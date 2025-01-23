-- Enable RLS on wines table
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to view wines
CREATE POLICY "Public can view wines" ON wines
  FOR SELECT TO PUBLIC USING (true);

-- Create policy to allow users to insert their own wines
CREATE POLICY "Users can insert their own wines" ON wines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own wines
CREATE POLICY "Users can update their own wines" ON wines
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own wines
CREATE POLICY "Users can delete their own wines" ON wines
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on related tables
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclaimer_icons ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to related tables
CREATE POLICY "Public can view ingredients" ON ingredients
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Public can view production variants" ON production_variants
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Public can view certifications" ON certifications
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Public can view disclaimer icons" ON disclaimer_icons
  FOR SELECT TO PUBLIC USING (true);

-- Create policies for write access to related tables
CREATE POLICY "Users can manage ingredients through wines" ON ingredients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ingredients through wines" ON ingredients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ingredients through wines" ON ingredients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

-- Create policies for production_variants
CREATE POLICY "Users can manage production variants through wines" ON production_variants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update production variants through wines" ON production_variants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete production variants through wines" ON production_variants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

-- Create policies for certifications
CREATE POLICY "Users can manage certifications through wines" ON certifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update certifications through wines" ON certifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete certifications through wines" ON certifications
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

-- Create policies for disclaimer_icons
CREATE POLICY "Users can manage disclaimer icons through wines" ON disclaimer_icons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update disclaimer icons through wines" ON disclaimer_icons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete disclaimer icons through wines" ON disclaimer_icons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM wines
      WHERE wines.id = wine_id
      AND wines.user_id = auth.uid()
    )
  ); 