DECLARE
  v_nature_id NUMBER;
  v_music_id NUMBER;
  v_food_id NUMBER;
  v_vehicles_id NUMBER;
  v_art_id NUMBER;
  v_sports_id NUMBER;
  v_architecture_id NUMBER;
  v_plants_id NUMBER;
  v_landscape_id NUMBER;
  v_animals_id NUMBER;
  v_pets_id NUMBER;
  v_wild_animals_id NUMBER;
  v_birds_id NUMBER;
  v_insects_id NUMBER;
  v_concert_id NUMBER;
  v_theater_id NUMBER;
  v_cars_id NUMBER;
  v_trains_id NUMBER;
  v_aircraft_id NUMBER;
  v_bicycles_id NUMBER;
  v_boats_id NUMBER;
  v_interior_id NUMBER;
  v_buildings_id NUMBER;
  v_religious_buildings_id NUMBER;
  v_house_id NUMBER;
  v_bridges_id NUMBER;
  v_towers_id NUMBER;
BEGIN
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Nature', 'Images depicting natural elements such as landscapes, animals, or plants.', NULL)
  RETURNING id INTO v_nature_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Music', 'Images related to musical events and performances.', NULL)
  RETURNING id INTO v_music_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Food and Drink', 'Images of meals, beverages, and culinary scenes.', NULL)
  RETURNING id INTO v_food_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Vehicles', 'Images of transportation such as cars, boats, or aircraft.', NULL)
  RETURNING id INTO v_vehicles_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Art', 'Images showcasing visual or performing arts.', NULL)
  RETURNING id INTO v_art_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Sports', 'Images capturing sporting events or physical activities.', NULL)
  RETURNING id INTO v_sports_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Architecture', 'Images of structures, buildings, and interior designs.', NULL)
  RETURNING id INTO v_architecture_id;

  -- Nature subcategories
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Plants', 'Images highlighting flowers, trees, and plant life.', v_nature_id)
  RETURNING id INTO v_plants_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Landscape', 'Images of natural scenery such as mountains or rivers.', v_nature_id)
  RETURNING id INTO v_landscape_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Animals', 'Images of animals in the wild or domestic settings.', v_nature_id)
  RETURNING id INTO v_animals_id;

  -- Animals subcategories
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Pets', 'Images of domestic animals such as dogs or cats.', v_animals_id)
  RETURNING id INTO v_pets_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Wild Animals', 'Images of untamed animals in their natural habitats.', v_animals_id)
  RETURNING id INTO v_wild_animals_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Birds', 'Images of birds in flight or perched.', v_animals_id)
  RETURNING id INTO v_birds_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Insects', 'Images of insects captured in detail.', v_animals_id)
  RETURNING id INTO v_insects_id;

  -- Music subcategories
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Concert', 'Images of live music performances and crowds.', v_music_id)
  RETURNING id INTO v_concert_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Theater', 'Images from plays and stage performances.', v_music_id)
  RETURNING id INTO v_theater_id;

  -- Vehicles subcategories
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Cars', 'Images of cars ranging from vintage to modern.', v_vehicles_id)
  RETURNING id INTO v_cars_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Trains', 'Images of locomotives, rail tracks, and stations.', v_vehicles_id)
  RETURNING id INTO v_trains_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Aircraft', 'Images of airplanes, helicopters, or jets.', v_vehicles_id)
  RETURNING id INTO v_aircraft_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Bicycles', 'Images of bicycles and cycling scenes.', v_vehicles_id)
  RETURNING id INTO v_bicycles_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Boats', 'Images of boats, ships, and maritime scenes.', v_vehicles_id)
  RETURNING id INTO v_boats_id;

  -- Architecture subcategories
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Interior', 'Images of indoor spaces, furniture, and design.', v_architecture_id)
  RETURNING id INTO v_interior_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Buildings', 'Images of architectural structures and buildings.', v_architecture_id)
  RETURNING id INTO v_buildings_id;

  -- Buildings subcategories
  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Religious Buildings', 'Images of churches, mosques, and temples.', v_buildings_id)
  RETURNING id INTO v_religious_buildings_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('House', 'Images of residential homes and dwellings.', v_buildings_id)
  RETURNING id INTO v_house_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Bridges', 'Images of bridges spanning water or land.', v_buildings_id)
  RETURNING id INTO v_bridges_id;

  INSERT INTO CATEGORY(name, description, parent_category_id)
  VALUES ('Towers', 'Images of tall structures such as towers or spires.', v_buildings_id)
  RETURNING id INTO v_towers_id;
END;
/
