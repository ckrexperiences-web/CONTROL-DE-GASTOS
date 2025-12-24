-- Create tables for Event Financial Control

-- 1. Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('planned', 'in_execution', 'finished')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Expense Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Responsibles
CREATE TABLE responsibles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Payment Methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    responsible_id UUID NOT NULL REFERENCES responsibles(id),
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'pending')),
    observations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Income
CREATE TABLE income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    concept TEXT NOT NULL,
    payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial data
INSERT INTO categories (name) VALUES ('Catering'), ('Venue'), ('Marketing'), ('Decor'), ('Staff'), ('Logistics');
INSERT INTO payment_methods (name) VALUES ('Efectivo'), ('Transferencia'), ('Yape'), ('Plin'), ('Tarjeta');
INSERT INTO responsibles (name) VALUES ('Producción'), ('Marketing Team'), ('Manager'), ('Vendedor X');

-- Enable RLS (Allow all for development - ADJUST BEFORE PRODUCTION)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON events FOR DELETE USING (true);

-- Repeat for others
CREATE POLICY "Allow public all" ON categories FOR ALL USING (true);
CREATE POLICY "Allow public all" ON responsibles FOR ALL USING (true);
CREATE POLICY "Allow public all" ON payment_methods FOR ALL USING (true);
CREATE POLICY "Allow public all" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow public all" ON income FOR ALL USING (true);
