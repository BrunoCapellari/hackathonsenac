
-- USERS
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ESTABLISHMENTS
CREATE TABLE estabelecimentos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(80),
    endereco TEXT,
    horario_funcionamento TEXT,
    imagem_url TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    estabelecimento_id BIGINT NOT NULL REFERENCES estabelecimentos(id),
    nome VARCHAR(150) NOT NULL,
    preco NUMERIC(10,2),
    foto_url TEXT,
    observacoes TEXT,
    descricao TEXT,
    publicado BOOLEAN DEFAULT FALSE
);

-- PRODUCT UPDATES
ALTER TABLE produtos
ADD COLUMN descricao_gerada TEXT,
ADD COLUMN descricao_final TEXT,
ADD COLUMN criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- PRICE VALIDATION
ALTER TABLE produtos
ADD CONSTRAINT chk_preco_positivo
CHECK (preco IS NULL OR preco >= 0);
