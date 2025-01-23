-- Insert dummy wines
INSERT INTO wines (
  id,
  created_at,
  user_id,
  name,
  ean_code,
  food_name,
  energy_kj,
  energy_kcal,
  fat,
  saturated_fat,
  carbohydrate,
  sugars,
  protein,
  salt,
  net_quantity_cl,
  has_estimation_sign,
  alcohol_percentage,
  optional_labelling,
  country_of_origin,
  place_of_origin,
  winery_information,
  instructions_for_use,
  conservation_conditions,
  drained_weight_grams,
  operator_name,
  operator_address,
  registration_number
) VALUES
-- Rioja Reserva
(
  'wine-001',
  NOW(),
  'YOUR_USER_ID', -- Replace with your Supabase user ID
  'Rioja Reserva 2018',
  '8413345000011',
  'Vino tinto',
  310,
  74,
  0,
  0,
  2.1,
  0.5,
  0.2,
  0.01,
  75,
  true,
  13.5,
  'Contiene sulfitos',
  'España',
  'D.O.Ca. Rioja',
  'Bodega Tradicional Riojana',
  'Servir entre 16-18°C',
  'Conservar en lugar fresco y seco',
  null,
  'Bodegas Riojanas S.A.',
  'Calle del Vino 1, 26350 Cenicero, La Rioja',
  'RE-12345-LR'
),
-- Albariño
(
  'wine-002',
  NOW(),
  'YOUR_USER_ID', -- Replace with your Supabase user ID
  'Albariño Rías Baixas 2022',
  '8413345000028',
  'Vino blanco',
  285,
  68,
  0,
  0,
  1.8,
  0.3,
  0.1,
  0.01,
  75,
  true,
  12.5,
  'Contiene sulfitos',
  'España',
  'D.O. Rías Baixas',
  'Bodega Atlántica',
  'Servir entre 8-10°C',
  'Conservar en lugar fresco y oscuro',
  null,
  'Bodegas Atlánticas S.L.',
  'Avenida del Mar 23, 36970 Pontevedra',
  'RE-67890-PO'
);

-- Insert ingredients for Rioja
INSERT INTO ingredients (id, wine_id, ingredient_name, is_allergen) VALUES
('ing-001', 'wine-001', 'Uva Tempranillo', false),
('ing-002', 'wine-001', 'Uva Garnacha', false),
('ing-003', 'wine-001', 'Sulfitos', true);

-- Insert ingredients for Albariño
INSERT INTO ingredients (id, wine_id, ingredient_name, is_allergen) VALUES
('ing-004', 'wine-002', 'Uva Albariño', false),
('ing-005', 'wine-002', 'Sulfitos', true);

-- Insert certifications for Rioja
INSERT INTO certifications (id, wine_id, certification_name) VALUES
('cert-001', 'wine-001', 'D.O.Ca. Rioja'),
('cert-002', 'wine-001', 'Agricultura Sostenible');

-- Insert certifications for Albariño
INSERT INTO certifications (id, wine_id, certification_name) VALUES
('cert-003', 'wine-002', 'D.O. Rías Baixas'),
('cert-004', 'wine-002', 'Producción Integrada');

-- Insert production variants for Rioja
INSERT INTO production_variants (id, wine_id, variant_name) VALUES
('var-001', 'wine-001', 'Crianza en barrica de roble francés'),
('var-002', 'wine-001', 'Crianza en barrica de roble americano');

-- Insert production variants for Albariño
INSERT INTO production_variants (id, wine_id, variant_name) VALUES
('var-003', 'wine-002', 'Fermentación en depósitos de acero inoxidable'),
('var-004', 'wine-002', 'Crianza sobre lías');

-- Insert disclaimer icons
INSERT INTO disclaimer_icons (id, wine_id, icon_name) VALUES
('icon-001', 'wine-001', 'Contiene sulfitos'),
('icon-002', 'wine-001', 'No recomendado para embarazadas'),
('icon-003', 'wine-002', 'Contiene sulfitos'),
('icon-004', 'wine-002', 'No recomendado para embarazadas'); 