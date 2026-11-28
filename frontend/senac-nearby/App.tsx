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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
};

// ---------------- TYPES ----------------
interface ProductDTO {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  notes?: string;
  accentColor?: string;
}

interface BusinessDTO {
  id: number;
  userId?: number;
  name: string;
  category: string;
  address: string;
  openingHours?: string;
  rating: number;
  reviewCount: number;
  walkTimeMinutes: number;
  isOpen: boolean;
  imageUrl?: string;
  bannerColor?: string;
  products: ProductDTO[];
}

interface AIQueryResponse {
  summary: string;
  recommendedBusinesses: BusinessDTO[];
}

type TabKey = 'home' | 'manage' | 'saved' | 'profile';

// ---------------- API & FALLBACK DATA ----------------
const DEFAULT_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;
const CURRENT_USER_ID = Number(process.env.EXPO_PUBLIC_USER_ID || '1');

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
    products: [
      { id: 301, name: 'Salada de Frutas', price: 9.0, accentColor: '#EAB338' },
      { id: 302, name: 'Mix de Castanhas', price: 12.5, accentColor: '#A87C64' },
      { id: 303, name: 'Suco Verde 400ml', price: 10.0, accentColor: '#76946A' },
    ],
  },
];

async function fetchBusinesses(category?: string): Promise<BusinessDTO[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/businesses`);
    if (!res.ok) throw new Error('Backend unavailable');
    const rawBusinesses = await res.json() as Array<{
      id: number;
      userId?: number;
      name: string;
      category?: string;
      address?: string;
      openingHours?: string;
      imageUrl?: string;
    }>;

    const businesses = await Promise.all(rawBusinesses.map(async (business) => {
      const productsRes = await fetch(`${API_BASE_URL}/businesses/${business.id}/products`);
      const rawProducts = productsRes.ok ? await productsRes.json() as Array<{
        id: number;
        name: string;
        price?: number;
        imageUrl?: string;
        notes?: string;
      }> : [];

      return {
        id: business.id,
        userId: business.userId,
        name: business.name,
        category: business.category || 'Comércio',
        address: business.address || 'Perto do Senac Canoas',
        openingHours: business.openingHours,
        rating: 4.8,
        reviewCount: 50,
        walkTimeMinutes: 5,
        isOpen: true,
        imageUrl: business.imageUrl,
        products: rawProducts.map((product, index) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price ?? 0),
          imageUrl: product.imageUrl,
          notes: product.notes,
          accentColor: ['#EAB338', '#98A886', '#C99E76'][index % 3],
        })),
      } satisfies BusinessDTO;
    }));

    if (!category || category === 'all') return businesses;
    return businesses.filter((business) => {
      const haystack = [
        business.category,
        business.name,
        ...business.products.map((product) => product.name),
      ].join(' ').toLowerCase();
      if (category === 'lanches') {
        return /lanche|padaria|café|cafeteria|comida|lanchonete/.test(haystack);
      }
      if (category === 'papelaria') return haystack.includes('papel') || haystack.includes('caderno');
      if (category === 'mercado') return /mercado|empório|fruta|hortifruti/.test(haystack);
      return haystack.includes(category.toLowerCase());
    });
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

async function chooseImage(
  onSelected: (imageDataUrl: string) => void,
  onError: (message: string) => void
) {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      onError('Permita o acesso às fotos para selecionar uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      onError('Não foi possível ler a imagem selecionada. Tente outra imagem.');
      return;
    }
    if ((asset.fileSize ?? 0) > 4 * 1024 * 1024 || asset.base64.length > 5_500_000) {
      onError('A imagem deve ter até 4 MB. Selecione uma imagem menor.');
      return;
    }

    onSelected(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Não foi possível selecionar a imagem.');
  }
}

function ImageField({
  label,
  value,
  onChange,
  onError,
}: {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  onError: (message: string) => void;
}) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.imageField}>
        {value ? (
          <Image source={{ uri: value }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imageEmpty}>
            <Ionicons name="image-outline" size={24} color={Colors.textMuted} />
          </View>
        )}
        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => void chooseImage(onChange, onError)}
          >
            <Ionicons name="images-outline" size={16} color={Colors.forestDark} />
            <Text style={styles.secondaryButtonText}>Selecionar imagem</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.formInput}
            value={value.startsWith('data:') ? '' : value}
            onChangeText={onChange}
            placeholder="Ou cole uma URL de imagem"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />
          {value ? (
            <TouchableOpacity onPress={() => onChange('')}>
              <Text style={styles.removeImageText}>Remover imagem</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Falha na API (${response.status}).`);
  }
  return response.json() as Promise<T>;
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
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [viewingBusinessId, setViewingBusinessId] = useState<number | null>(null);
  const [storeDraft, setStoreDraft] = useState({
    name: '',
    category: '',
    address: '',
    openingHours: '',
    imageUrl: '',
  });
  const [productDraft, setProductDraft] = useState({
    name: '',
    price: '',
    notes: '',
    imageUrl: '',
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isSavingStore, setIsSavingStore] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [managementMessage, setManagementMessage] = useState<string | null>(null);
  const [managementError, setManagementError] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory]);

  const loadBusinesses = async (category = selectedCategory) => {
    setAiSummary(null);
    const data = await fetchBusinesses(category);
    setBusinesses(data);
  };

  const handleAISearch = async (queryText?: string) => {
    const q = (queryText ?? searchText).trim();
    if (!q) return;
    setIsSearchingAI(true);
    setAppError(null);
    try {
      const response = await queryAIProducts(q);
      setBusinesses(response.recommendedBusinesses);
      setAiSummary(response.summary);
    } catch (error) {
      setAppError(error instanceof Error ? error.message : 'Falha ao pesquisar.');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const startNewStore = () => {
    setSelectedBusinessId(null);
    setStoreDraft({
      name: '',
      category: '',
      address: '',
      openingHours: '',
      imageUrl: '',
    });
    setProductDraft({ name: '', price: '', notes: '', imageUrl: '' });
    setEditingProductId(null);
    setManagementMessage(null);
    setManagementError(null);
  };

  const startEditingStore = (business: BusinessDTO) => {
    if (business.userId !== CURRENT_USER_ID) {
      setManagementError('Você só pode editar estabelecimentos vinculados ao seu usuário.');
      return;
    }
    setSelectedBusinessId(business.id);
    setStoreDraft({
      name: business.name,
      category: business.category,
      address: business.address,
      openingHours: business.openingHours ?? '',
      imageUrl: business.imageUrl ?? '',
    });
    setProductDraft({ name: '', price: '', notes: '', imageUrl: '' });
    setEditingProductId(null);
    setManagementMessage(null);
    setManagementError(null);
  };

  const saveStore = async () => {
    if (!storeDraft.name.trim()) {
      setManagementError('Informe o nome do estabelecimento.');
      return;
    }
    if (!Number.isInteger(CURRENT_USER_ID) || CURRENT_USER_ID < 1) {
      setManagementError('Configure um EXPO_PUBLIC_USER_ID válido para salvar estabelecimentos.');
      return;
    }
    if (
      selectedBusinessId !== null &&
      businesses.find((business) => business.id === selectedBusinessId)?.userId !== CURRENT_USER_ID
    ) {
      setManagementError('Você só pode editar estabelecimentos vinculados ao seu usuário.');
      return;
    }

    setIsSavingStore(true);
    setManagementError(null);
    setManagementMessage(null);
    try {
      const payload = {
        userId: CURRENT_USER_ID,
        name: storeDraft.name.trim(),
        category: storeDraft.category.trim(),
        address: storeDraft.address.trim(),
        openingHours: storeDraft.openingHours.trim(),
        imageUrl: storeDraft.imageUrl || null,
      };
      const saved = await apiRequest<{ id: number }>(
        selectedBusinessId === null ? '/businesses' : `/businesses/${selectedBusinessId}`,
        {
          method: selectedBusinessId === null ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      setSelectedBusinessId(saved.id);
      await loadBusinesses('all');
      setManagementMessage('Estabelecimento salvo.');
    } catch (error) {
      setManagementError(error instanceof Error ? error.message : 'Falha ao salvar estabelecimento.');
    } finally {
      setIsSavingStore(false);
    }
  };

  const saveProduct = async () => {
    if (selectedBusinessId === null) {
      setManagementError('Salve ou selecione um estabelecimento antes de adicionar produtos.');
      return;
    }
    if (businesses.find((business) => business.id === selectedBusinessId)?.userId !== CURRENT_USER_ID) {
      setManagementError('Você só pode gerenciar produtos das suas lojas.');
      return;
    }
    const price = Number(productDraft.price.replace(',', '.'));
    if (!productDraft.name.trim() || !Number.isFinite(price) || price < 0) {
      setManagementError('Informe o nome do produto e um preço válido.');
      return;
    }

    setIsSavingProduct(true);
    setManagementError(null);
    setManagementMessage(null);
    try {
      const payload = {
        name: productDraft.name.trim(),
        price,
        notes: productDraft.notes.trim(),
        imageUrl: productDraft.imageUrl || null,
        businessId: selectedBusinessId,
      };
      await apiRequest(
        editingProductId === null ? '/products' : `/products/${editingProductId}`,
        {
          method: editingProductId === null ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      await loadBusinesses('all');
      setProductDraft({ name: '', price: '', notes: '', imageUrl: '' });
      setEditingProductId(null);
      setManagementMessage('Produto salvo.');
    } catch (error) {
      setManagementError(error instanceof Error ? error.message : 'Falha ao salvar produto.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const startEditingProduct = (product: ProductDTO) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      price: String(product.price),
      notes: product.notes ?? '',
      imageUrl: product.imageUrl ?? '',
    });
    setManagementError(null);
    setManagementMessage(null);
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

  const managingBusiness = businesses.find((business) => business.id === selectedBusinessId);
  const viewingBusiness = businesses.find((business) => business.id === viewingBusinessId);
  const ownedBusinesses = businesses.filter((business) => business.userId === CURRENT_USER_ID);

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
              <Text style={styles.discoverLabel}>
                {activeTab === 'manage' ? 'PAINEL DO COMÉRCIO' : 'DESCOBRIR PERTO DE'}
              </Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationTitle}>{SENAC_CANOAS_LOCATION.name}</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'manage' ? (
            <View style={styles.manageScreen}>
              <View style={styles.manageHeader}>
                <View>
                  <Text style={styles.eyebrow}>ÁREA DO LOJISTA</Text>
                  <Text style={styles.sectionTitle}>Lojas e produtos</Text>
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={startNewStore}>
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Nova loja</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.storeList}>
                {ownedBusinesses.map((business) => (
                  <TouchableOpacity
                    key={business.id}
                    style={[
                      styles.storeListItem,
                      selectedBusinessId === business.id && styles.storeListItemActive,
                    ]}
                    onPress={() => startEditingStore(business)}
                  >
                    {business.imageUrl ? (
                      <Image source={{ uri: business.imageUrl }} style={styles.storeListImage} />
                    ) : (
                      <View style={styles.storeListImagePlaceholder}>
                        <Ionicons name="storefront-outline" size={20} color={Colors.forestDark} />
                      </View>
                    )}
                    <View style={styles.storeListText}>
                      <Text style={styles.storeListName} numberOfLines={1}>{business.name}</Text>
                      <Text style={styles.storeListMeta} numberOfLines={1}>
                        {business.category} · {business.products.length} produto(s)
                      </Text>
                    </View>
                    <Ionicons name="create-outline" size={18} color={Colors.forestDark} />
                  </TouchableOpacity>
                ))}
                {ownedBusinesses.length === 0 ? (
                  <Text style={styles.emptyProducts}>
                    Você ainda não cadastrou lojas com o usuário {CURRENT_USER_ID}.
                  </Text>
                ) : null}
              </View>

              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  {selectedBusinessId === null ? 'Cadastrar estabelecimento' : 'Editar estabelecimento'}
                </Text>
                <Text style={styles.ownerNote}>
                  Esta loja será vinculada ao usuário {CURRENT_USER_ID}.
                </Text>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Nome da loja</Text>
                  <TextInput
                    style={styles.formInput}
                    value={storeDraft.name}
                    onChangeText={(name) => setStoreDraft((draft) => ({ ...draft, name }))}
                    placeholder="Nome do estabelecimento"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Categoria</Text>
                  <TextInput
                    style={styles.formInput}
                    value={storeDraft.category}
                    onChangeText={(category) => setStoreDraft((draft) => ({ ...draft, category }))}
                    placeholder="Ex.: Padaria, Papelaria"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Endereço</Text>
                  <TextInput
                    style={styles.formInput}
                    value={storeDraft.address}
                    onChangeText={(address) => setStoreDraft((draft) => ({ ...draft, address }))}
                    placeholder="Endereço da loja"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Horário de funcionamento</Text>
                  <TextInput
                    style={styles.formInput}
                    value={storeDraft.openingHours}
                    onChangeText={(openingHours) => setStoreDraft((draft) => ({ ...draft, openingHours }))}
                    placeholder="Ex.: Seg-Sex, 08:00-18:00"
                  />
                </View>
                <ImageField
                  label="Imagem da loja"
                  value={storeDraft.imageUrl}
                  onChange={(imageUrl) => setStoreDraft((draft) => ({ ...draft, imageUrl }))}
                  onError={setManagementError}
                />
                <TouchableOpacity
                  style={[styles.primaryButton, styles.saveButton]}
                  onPress={() => void saveStore()}
                  disabled={isSavingStore}
                >
                  {isSavingStore ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Salvar estabelecimento</Text>
                  )}
                </TouchableOpacity>
              </View>

              {selectedBusinessId !== null ? (
                <View style={styles.formCard}>
                  <Text style={styles.formTitle}>Produtos da loja</Text>
                  {managingBusiness?.products.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productEditRow}
                      onPress={() => startEditingProduct(product)}
                    >
                      {product.imageUrl ? (
                        <Image source={{ uri: product.imageUrl }} style={styles.productEditImage} />
                      ) : (
                        <View style={styles.productEditImagePlaceholder}>
                          <Ionicons name="image-outline" size={18} color={Colors.textMuted} />
                        </View>
                      )}
                      <View style={styles.storeListText}>
                        <Text style={styles.storeListName} numberOfLines={1}>{product.name}</Text>
                        <Text style={styles.storeListMeta}>
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                      <Ionicons name="create-outline" size={18} color={Colors.forestDark} />
                    </TouchableOpacity>
                  ))}
                  {managingBusiness?.products.length === 0 ? (
                    <Text style={styles.emptyProducts}>Ainda não há produtos nesta loja.</Text>
                  ) : null}

                  <Text style={styles.formSubtitle}>
                    {editingProductId === null ? 'Adicionar produto' : 'Editar produto'}
                  </Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nome do produto</Text>
                    <TextInput
                      style={styles.formInput}
                      value={productDraft.name}
                      onChangeText={(name) => setProductDraft((draft) => ({ ...draft, name }))}
                      placeholder="Nome do produto"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Preço (R$)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={productDraft.price}
                      onChangeText={(price) => setProductDraft((draft) => ({ ...draft, price }))}
                      placeholder="0,00"
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Detalhes</Text>
                    <TextInput
                      style={[styles.formInput, styles.multilineInput]}
                      value={productDraft.notes}
                      onChangeText={(notes) => setProductDraft((draft) => ({ ...draft, notes }))}
                      placeholder="Descrição ou observações"
                      multiline
                    />
                  </View>
                  <ImageField
                    label="Imagem do produto"
                    value={productDraft.imageUrl}
                    onChange={(imageUrl) => setProductDraft((draft) => ({ ...draft, imageUrl }))}
                    onError={setManagementError}
                  />
                  <View style={styles.formButtonRow}>
                    {editingProductId !== null ? (
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                          setEditingProductId(null);
                          setProductDraft({ name: '', price: '', notes: '', imageUrl: '' });
                        }}
                      >
                        <Text style={styles.secondaryButtonText}>Cancelar edição</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={[styles.primaryButton, styles.saveButton]}
                      onPress={() => void saveProduct()}
                      disabled={isSavingProduct}
                    >
                      {isSavingProduct ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>
                          {editingProductId === null ? 'Adicionar produto' : 'Salvar produto'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {managementError ? <Text style={styles.errorMessage}>{managementError}</Text> : null}
              {managementMessage ? <Text style={styles.successMessage}>{managementMessage}</Text> : null}
            </View>
          ) : (
            <>
          {appError ? <Text style={styles.errorMessage}>{appError}</Text> : null}
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
                  <TouchableOpacity onPress={() => void loadBusinesses()}>
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
                      style={styles.viewStoreButton}
                      onPress={() => setViewingBusinessId(biz.id)}
                    >
                      <Text style={styles.viewStoreText}>Ver loja</Text>
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
                        {prod.imageUrl ? (
                          <Image source={{ uri: prod.imageUrl }} style={styles.prodThumb} />
                        ) : (
                          <View
                            style={[
                              styles.prodThumb,
                              { backgroundColor: prod.accentColor || Colors.accentYellow },
                            ]}
                          />
                        )}
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
            </>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomBar}>
          {(
            [
              { key: 'home', label: 'Início', icon: 'home' },
              { key: 'manage', label: 'Gerenciar', icon: 'storefront-outline' },
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
                  setActiveTab(tab.key);
                  if (tab.key === 'manage') void loadBusinesses('all');
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

        <Modal
          visible={viewingBusiness !== undefined}
          animationType="slide"
          onRequestClose={() => setViewingBusinessId(null)}
        >
          <SafeAreaView style={styles.storeDetailScreen}>
            {viewingBusiness ? (
              <>
                <View style={styles.detailHeader}>
                  <View style={styles.detailHeaderText}>
                    <Text style={styles.modalTitle} numberOfLines={1}>{viewingBusiness.name}</Text>
                    <Text style={styles.modalSub}>{viewingBusiness.category}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeDetailButton}
                    onPress={() => setViewingBusinessId(null)}
                  >
                    <Ionicons name="close" size={22} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.detailContent}>
                  {viewingBusiness.imageUrl ? (
                    <Image source={{ uri: viewingBusiness.imageUrl }} style={styles.detailStoreImage} />
                  ) : (
                    <View style={styles.detailStorePlaceholder}>
                      <Ionicons name="storefront-outline" size={44} color={Colors.forestDark} />
                    </View>
                  )}
                  <Text style={styles.detailSectionTitle}>Sobre a loja</Text>
                  <Text style={styles.detailText}>{viewingBusiness.address}</Text>
                  {viewingBusiness.openingHours ? (
                    <Text style={styles.detailText}>{viewingBusiness.openingHours}</Text>
                  ) : null}
                  <Text style={styles.detailSectionTitle}>Produtos</Text>
                  {viewingBusiness.products.map((product) => (
                    <View key={product.id} style={styles.detailProduct}>
                      {product.imageUrl ? (
                        <Image source={{ uri: product.imageUrl }} style={styles.detailProductImage} />
                      ) : (
                        <View style={styles.detailProductPlaceholder}>
                          <Ionicons name="image-outline" size={20} color={Colors.textMuted} />
                        </View>
                      )}
                      <View style={styles.detailProductInfo}>
                        <Text style={styles.detailProductName}>{product.name}</Text>
                        {product.notes ? <Text style={styles.detailText}>{product.notes}</Text> : null}
                        <Text style={styles.detailProductPrice}>
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {viewingBusiness.products.length === 0 ? (
                    <Text style={styles.detailText}>Ainda não há produtos cadastrados.</Text>
                  ) : null}
                </ScrollView>
                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => setViewingBusinessId(null)}
                  >
                    <Text style={styles.secondaryButtonText}>Fechar</Text>
                  </TouchableOpacity>
                  {viewingBusiness.userId === CURRENT_USER_ID ? (
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => {
                        startEditingStore(viewingBusiness);
                        setViewingBusinessId(null);
                        setActiveTab('manage');
                        void loadBusinesses('all');
                      }}
                    >
                      <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Editar minha loja</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </>
            ) : null}
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
  manageScreen: { paddingHorizontal: 16, paddingBottom: 24 },
  manageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  primaryButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.forestDark,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  ownerNote: { fontSize: 12, color: Colors.textSecondary, marginBottom: 14 },
  storeList: { gap: 8, marginBottom: 14 },
  storeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storeListItemActive: { borderColor: Colors.forestDark, backgroundColor: Colors.badgeGreenBg },
  storeListImage: { width: 42, height: 42, borderRadius: 10 },
  storeListImagePlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  storeListText: { flex: 1 },
  storeListName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  storeListMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 3 },
  formCard: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  formSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 18,
    marginBottom: 12,
  },
  formGroup: { marginBottom: 12, gap: 6 },
  formLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  formInput: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  multilineInput: { minHeight: 76, textAlignVertical: 'top' },
  imageField: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  imagePreview: { width: 88, height: 88, borderRadius: 12, backgroundColor: Colors.surfaceMuted },
  imageEmpty: {
    width: 88,
    height: 88,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  imageActions: { flex: 1, gap: 8 },
  secondaryButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.surfaceMuted,
  },
  secondaryButtonText: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  removeImageText: { fontSize: 12, fontWeight: '600', color: '#A33B32' },
  saveButton: { alignSelf: 'flex-start', minWidth: 150 },
  productEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productEditImage: { width: 42, height: 42, borderRadius: 10 },
  productEditImagePlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  emptyProducts: { color: Colors.textSecondary, fontSize: 13, paddingVertical: 10 },
  formButtonRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  errorMessage: {
    color: '#9B2C23',
    backgroundColor: '#FCE9E7',
    padding: 11,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    fontSize: 13,
  },
  successMessage: {
    color: Colors.badgeGreenText,
    backgroundColor: Colors.badgeGreenBg,
    padding: 11,
    borderRadius: 10,
    marginTop: 8,
    fontSize: 13,
  },
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
  viewStoreButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewStoreText: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
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
  storeDetailScreen: { flex: 1, backgroundColor: Colors.background },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailHeaderText: { flex: 1, marginRight: 12 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  modalSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  closeDetailButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: Colors.surfaceMuted,
  },
  detailContent: { padding: 16, paddingBottom: 24 },
  detailStoreImage: { width: '100%', height: 200, borderRadius: 18, marginBottom: 18 },
  detailStorePlaceholder: {
    width: '100%',
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
    marginBottom: 18,
  },
  detailSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 8,
  },
  detailText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  detailProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailProductImage: { width: 72, height: 72, borderRadius: 12 },
  detailProductPlaceholder: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.surfaceMuted,
  },
  detailProductInfo: { flex: 1 },
  detailProductName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  detailProductPrice: { fontSize: 14, fontWeight: '700', color: Colors.forestDark, marginTop: 3 },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});