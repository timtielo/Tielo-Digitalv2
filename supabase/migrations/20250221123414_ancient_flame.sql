/*
  # Update dashboard metrics order

  1. Changes
    - Reorders dashboard metrics to:
      1. Extra revenue
      2. Hours saved  
      3. Average ROI
      4. Satisfied clients
*/

DO $$
BEGIN
  -- First, delete existing metrics
  DELETE FROM dashboard_metrics;

  -- Insert metrics in the new order
  INSERT INTO dashboard_metrics (metric_key, value, title, subtitle) VALUES
    ('extra_revenue', '€35803', 'Extra Omzet', 'Voor onze klanten'),
    ('hours_saved', '100+', 'Uren Bespaard', 'Door blijvende automatisatie'),
    ('average_roi', '1189%', 'Gemiddelde ROI', 'Return on Investment'),
    ('satisfied_clients', '3', 'Tevreden Klanten', 'Succesvolle samenwerkingen');
END $$;