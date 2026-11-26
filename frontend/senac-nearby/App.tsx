import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

// ---------------- THEME & LOCATION ----------------
const Colors = {
  background: '#F7F5EE',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EFE6',
  forestDark: '#17382B',
  forestMedium: '#234C3B',
  forestPill: '#264B3C',
  accentYellow: '#EAB338',
  accentGoldText: '#C89216',
  badgeGreenBg: '#EAF4EC',
  badgeGreenText: '#236B3B',
  textPrimary: '#1A241E',
  textSecondary: '#68736C',
  textMuted: '#8F9992',
  border: '#E5E1D5',
};

const SENAC_CANOAS_LOCATION = {
  name: 'Senac Canoas',
  subtitle: 'R. Mathias Velho, 255 · Centro, Canoas - RS',
  latitude: -29.9145,
  longitude: -51.1836,
};

// ---------------- TYPES ----------------
interface ProductDTO {
  id: number;
  name: string;
  price: number;
  accentColor?: string;
}

interface BusinessDTO {
  id: number;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  walkTimeMinutes: number;
  isOpen: boolean;
  imageUrl?: string;
  bannerColor?: string;
  latitude?: number;
  longitude?: number;
  products: ProductDTO[];
}

interface AIQueryResponse {
  summary: string;
  recommendedBusinesses: BusinessDTO[];
}

type TabKey = 'home' | 'explore' | 'saved' | 'profile';

// ---------------- API & FALLBACK DATA ----------------
const DEFAULT_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

const FALLBACK_BUSINESSES: BusinessDTO[] = [
  {
    id: 1,
    name: 'Paladar Lanches & Café',
    category: 'Padaria · Lanches',
    address: 'R. Muck, 224 - Centro, Canoas - RS',
    rating: 4.9,
    reviewCount: 142,
    walkTimeMinutes: 3,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    latitude: -29.9154,
    longitude: -51.1829,
    products: [
      { id: 101, name: 'Torrada Americana', price: 11.5, accentColor: '#EAB338' },
      { id: 102, name: 'Focaccia de Frango', price: 14.0, accentColor: '#98A886' },
      { id: 103, name: 'Café Gelado', price: 8.5, accentColor: '#C99E76' },
    ],
  },
  {
    id: 2,
    name: 'Papelaria Centro Canoas',
    category: 'Papelaria · Cópias',
    address: 'R. Tiradentes, 260 - Centro, Canoas - RS',
    rating: 4.8,
    reviewCount: 89,
    walkTimeMinutes: 5,
    isOpen: true,
    bannerColor: '#E07A5F',
    latitude: -29.9168,
    longitude: -51.1821,
    products: [
      { id: 201, name: 'Caderno Smart 10M', price: 24.9, accentColor: '#E07A5F' },
      { id: 202, name: 'Kit Canetas Gel', price: 16.5, accentColor: '#7A8B99' },
      { id: 203, name: 'Impressão Colorida', price: 2.0, accentColor: '#EAB338' },
    ],
  },
  {
    id: 3,
    name: 'Fruteira & Empório Mathias',
    category: 'Mercado · Lanches',
    address: 'R. Mathias Velho, 410 - Centro, Canoas - RS',
    rating: 4.7,
    reviewCount: 203,
    walkTimeMinutes: 4,
    isOpen: true,
    bannerColor: '#76946A',
    latitude: -29.9138,
    longitude: -51.1852,
    products: [
      { id: 301, name: 'Salada de Frutas', price: 9.0, accentColor: '#EAB338' },
      { id: 302, name: 'Mix de Castanhas', price: 12.5, accentColor: '#A87C64' },
      { id: 303, name: 'Suco Verde 400ml', price: 10.0, accentColor: '#76946A' },
    ],
  },
];

async function fetchBusinesses(category?: string): Promise<BusinessDTO[]> {
  try {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE_URL}/businesses${query}`);
    if (!res.ok) throw new Error('Backend unavailable');
    return await res.json();
  } catch {
    if (!category || category === 'all') return FALLBACK_BUSINESSES;
    return FALLBACK_BUSINESSES.filter((b) =>
      b.category.toLowerCase().includes(category.toLowerCase())
    );
  }
}

async function queryAIProducts(prompt: string): Promise<AIQueryResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: prompt,
        originLocation: 'Senac Canoas - R. Mathias Velho, 255, Canoas - RS',
      }),
    });
    if (!res.ok) throw new Error('AI unavailable');
    return await res.json();
  } catch {
    const q = prompt.toLowerCase();
    const scored = FALLBACK_BUSINESSES.map((biz) => {
      const matchingProducts = biz.products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          biz.category.toLowerCase().includes(q) ||
          (q.includes('lanche') && biz.category.toLowerCase().includes('lanches')) ||
          (q.includes('barato') && p.price <= 15) ||
          (q.includes('caderno') && biz.category.toLowerCase().includes('papelaria'))
      );
      return {
        ...biz,
        products: matchingProducts.length > 0 ? matchingProducts : biz.products,
        _score: matchingProducts.length,
      };
    }).filter((b) => b._score > 0 || q.trim() === '');

    const results = scored.length > 0 ? scored : FALLBACK_BUSINESSES;
    return {
      summary: `IA encontrou ${results.length} comércios perto do Senac Canoas para "${prompt}".`,
      recommendedBusinesses: results,
    };
  }
}

// ---------------- MAIN APP ----------------
export default function App() {
  const [businesses, setBusinesses] = useState<BusinessDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [searchText, setSearchText] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [focusedBusiness, setFocusedBusiness] = useState<BusinessDTO | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory]);

  const loadBusinesses = async () => {
    setAiSummary(null);
    const data = await fetchBusinesses(selectedCategory);
    setBusinesses(data);
  };

  const handleAISearch = async (queryText?: string) => {
    const q = (queryText ?? searchText).trim();
    if (!q) return;
    setIsSearchingAI(true);
    const response = await queryAIProducts(q);
    setBusinesses(response.recommendedBusinesses);
    setAiSummary(response.summary);
    setIsSearchingAI(false);
  };

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const displayedBusinesses =
    activeTab === 'saved'
      ? businesses.filter((b) => savedIds.includes(b.id))
      : businesses;

  const lat = focusedBusiness?.latitude ?? SENAC_CANOAS_LOCATION.latitude;
  const lon = focusedBusiness?.longitude ?? SENAC_CANOAS_LOCATION.longitude;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.006}%2C${
    lat - 0.005
  }%2C${lon + 0.006}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lon}`;

  const categories = [
    { id: 'all', label: 'Todos perto', icon: 'compass-outline' as const },
    { id: 'lanches', label: 'Comida & café', icon: 'cafe-outline' as const },
    { id: 'papelaria', label: 'Papelaria', icon: 'book-outline' as const },
    { id: 'mercado', label: 'Mercado', icon: 'basket-outline' as const },
  ];

  const studentPrompts = [
    'Lanche rápido até R$ 15',
    'Caderno e canetas',
    'Café antes da aula',
  ];

  return (
    <SafeAreaView style={styles.outerWrapper}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.schoolBadge}>
              <Ionicons name="school" size={18} color={Colors.forestDark} />
            </View>
            <View>
              <Text style={styles.discoverLabel}>DESCOBRIR PERTO DE</Text>
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => {
                  setFocusedBusiness(null);
                  setMapVisible(true);
                }}
              >
                <Text style={styles.locationTitle}>{SENAC_CANOAS_LOCATION.name}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => {
              setFocusedBusiness(null);
              setMapVisible(true);
            }}
          >
            <Ionicons name="map-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'home' && (
            <View style={styles.aiCard}>
              <View style={styles.bgCircle} />
              <View style={styles.bgYellowCircle} />

              <View style={styles.aiTagRow}>
                <Ionicons name="sparkles" size={13} color={Colors.accentYellow} />
                <Text style={styles.aiTagText}>SENAC CANOAS AI</Text>
              </View>

              <Text style={styles.aiHeadline}>O que você precisa perto da escola hoje?</Text>
              <Text style={styles.aiSub}>
                A IA mostra produtos, preços e a caminhada mais rápida da R. Mathias Velho.
              </Text>

              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Lanche rápido, caderno, café..."
                  placeholderTextColor={Colors.textMuted}
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={() => handleAISearch()}
                />
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => handleAISearch()}
                  disabled={isSearchingAI}
                >
                  {isSearchingAI ? (
                    <ActivityIndicator size="small" color={Colors.forestDark} />
                  ) : (
                    <Ionicons name="arrow-forward" size={18} color={Colors.forestDark} />
                  )}
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {studentPrompts.map((chip) => (
                  <TouchableOpacity
                    key={chip}
                    style={styles.chip}
                    onPress={() => {
                      setSearchText(chip);
                      handleAISearch(chip);
                    }}
                  >
                    <Text style={styles.chipText}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {aiSummary ? (
                <View style={styles.aiBanner}>
                  <Text style={styles.aiBannerText}>{aiSummary}</Text>
                  <TouchableOpacity onPress={loadBusinesses}>
                    <Text style={styles.clearBtnText}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>AO REDOR DO SENAC CANOAS</Text>
              <Text style={styles.sectionTitle}>
                {activeTab === 'saved' ? 'Comércios salvos' : 'Destaques perto da escola'}
              </Text>
            </View>
            <Text style={styles.sectionMeta}>{displayedBusinesses.length} locais · 10 min</Text>
          </View>

          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {categories.map((cat) => {
              const active = cat.id === selectedCategory;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={15}
                    color={active ? '#FFFFFF' : Colors.textPrimary}
                  />
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Business Cards */}
          {displayedBusinesses.map((biz) => {
            const isSaved = savedIds.includes(biz.id);
            return (
              <View key={biz.id} style={styles.bizCard}>
                <View style={styles.mediaBox}>
                  {biz.imageUrl ? (
                    <Image source={{ uri: biz.imageUrl }} style={styles.bannerImg} />
                  ) : (
                    <View
                      style={[
                        styles.bannerPlaceholder,
                        { backgroundColor: biz.bannerColor || '#76946A' },
                      ]}
                    >
                      <Ionicons
                        name="storefront-outline"
                        size={42}
                        color="rgba(255,255,255,0.85)"
                      />
                    </View>
                  )}
                  <View style={styles.openBadge}>
                    <Text style={styles.openText}>
                      {biz.isOpen ? 'Aberto agora' : 'Fechado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.bizBody}>
                  <View style={styles.bizTopRow}>
                    <View style={styles.bizTitleCol}>
                      <View style={styles.ratingRow}>
                        <Text style={styles.bizName} numberOfLines={1}>
                          {biz.name}
                        </Text>
                        <Ionicons name="star" size={14} color={Colors.accentYellow} />
                        <Text style={styles.ratingNum}>{biz.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewNum}>({biz.reviewCount})</Text>
                      </View>
                      <Text style={styles.bizMeta}>
                        {biz.category} ·{' '}
                        <Text style={styles.walkTime}>{biz.walkTimeMinutes} min a pé</Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.bookmarkBtn}
                      onPress={() => toggleSave(biz.id)}
                    >
                      <Ionicons
                        name={isSaved ? 'bookmark' : 'bookmark-outline'}
                        size={18}
                        color={isSaved ? Colors.forestDark : Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.productsHeader}>
                    <View style={styles.productsLabelRow}>
                      <Ionicons name="sparkles" size={12} color={Colors.accentYellow} />
                      <Text style={styles.productsLabel}>PRODUTOS EM DESTAQUE (IA)</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewShopRow}
                      onPress={() => {
                        setFocusedBusiness(biz);
                        setMapVisible(true);
                      }}
                    >
                      <Text style={styles.viewShopText}>Ver loja</Text>
                      <Ionicons name="chevron-forward" size={13} color={Colors.forestDark} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productsRow}
                  >
                    {biz.products.map((prod) => (
                      <View key={prod.id} style={styles.productItem}>
                        <View
                          style={[
                            styles.prodThumb,
                            { backgroundColor: prod.accentColor || Colors.accentYellow },
                          ]}
                        />
                        <View>
                          <Text style={styles.prodName} numberOfLines={1}>
                            {prod.name}
                          </Text>
                          <Text style={styles.prodPrice}>
                            R$ {prod.price.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomBar}>
          {(
            [
              { key: 'home', label: 'Início', icon: 'home' },
              { key: 'explore', label: 'Explorar', icon: 'compass-outline' },
              { key: 'saved', label: 'Salvos', icon: 'bookmark-outline' },
              { key: 'profile', label: 'Perfil', icon: 'person-outline' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.navTab}
                onPress={() => {
                  if (tab.key === 'explore') {
                    setFocusedBusiness(null);
                    setMapVisible(true);
                  } else {
                    setActiveTab(tab.key);
                  }
                }}
              >
                {active && <View style={styles.activeTopLine} />}
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={active ? Colors.forestDark : Colors.textSecondary}
                />
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* WebView Map Modal */}
        <Modal
          visible={mapVisible}
          animationType="slide"
          onRequestClose={() => setMapVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {focusedBusiness ? focusedBusiness.name : 'Mapa — Senac Canoas'}
                </Text>
                <Text style={styles.modalSub}>
                  {focusedBusiness
                    ? `${focusedBusiness.address} (${focusedBusiness.walkTimeMinutes} min a pé)`
                    : SENAC_CANOAS_LOCATION.subtitle}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setMapVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.mapBox}>
              {Platform.OS === 'web' ? (
                // @ts-ignore iframe is rendered on Expo Web
                <iframe
                  src={mapUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Mapa Senac Canoas"
                />
              ) : (
                <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#E6E2D6' : Colors.background,
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  schoolBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.accentYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoverLabel: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  locationTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  mapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  aiCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: Colors.forestDark,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  bgCircle: {
    position: 'absolute',
    right: -40,
    top: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.forestMedium,
    opacity: 0.55,
  },
  bgYellowCircle: {
    position: 'absolute',
    right: 60,
    bottom: -36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accentYellow,
  },
  aiTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiTagText: { color: Colors.accentYellow, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  aiHeadline: { color: '#FFFFFF', fontSize: 23, fontWeight: '700', lineHeight: 29, marginBottom: 6 },
  aiSub: { color: '#C7D6CE', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 6,
    height: 50,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  submitBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.accentYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 14, paddingRight: 16 },
  chip: {
    backgroundColor: Colors.forestPill,
    borderWidth: 1,
    borderColor: '#37614F',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: { color: '#E5EFEA', fontSize: 12 },
  aiBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  aiBannerText: { color: '#FFFFFF', fontSize: 12, flex: 1 },
  clearBtnText: { color: Colors.accentYellow, fontSize: 12, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    marginTop: 20,
  },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: Colors.accentGoldText },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  sectionMeta: { fontSize: 12, color: Colors.textSecondary },
  pillsRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.forestDark, borderColor: Colors.forestDark },
  pillText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  pillTextActive: { color: '#FFFFFF' },
  bizCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  mediaBox: { height: 145, width: '100%', position: 'relative' },
  bannerImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  openBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
  },
  openText: { fontSize: 11, fontWeight: '700', color: Colors.badgeGreenText },
  bizBody: { padding: 16 },
  bizTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bizTitleCol: { flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  bizName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginRight: 4 },
  ratingNum: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  reviewNum: { fontSize: 12, color: Colors.textMuted },
  bizMeta: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  walkTime: { fontWeight: '700', color: Colors.forestDark },
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  productsLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  productsLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary },
  viewShopRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewShopText: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  productsRow: { gap: 10 },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 14,
    padding: 8,
    paddingRight: 12,
    gap: 9,
  },
  prodThumb: { width: 34, height: 34, borderRadius: 10 },
  prodName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  prodPrice: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginTop: 1 },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 10,
    paddingTop: 6,
  },
  navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 4 },
  activeTopLine: {
    position: 'absolute',
    top: -6,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.accentYellow,
  },
  navLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, marginTop: 3 },
  navLabelActive: { color: Colors.forestDark, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  modalSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBox: { flex: 1 },
});