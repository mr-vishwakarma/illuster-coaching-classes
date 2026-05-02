-- Seed initial courses into the database (Phase 7 fix)
-- Using fixed UUIDs for consistency during development
INSERT INTO courses (id, title, description, category, price, image_url, is_published)
VALUES 
('d1a929ff-d439-4465-9117-2aaaa91e69b4', 'JEE Physics Pro', 'Comprehensive JEE Physics covering Mechanics, Electrostatics, Optics, and Modern Physics.', 'JEE', 24999, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', true),
('38043758-f133-4a7e-96b8-bd1ee715aafb', 'JEE Chemistry Master', 'Deep-dive into Physical, Organic, and Inorganic Chemistry with exam-focused shortcuts.', 'JEE', 22999, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', true),
('184ff064-806f-40c9-b7fd-89af112fa26f', 'JEE Mathematics Elite', 'From Algebra to Calculus, this course builds razor-sharp problem-solving speed.', 'JEE', 23999, 'https://images.unsplash.com/photo-1509228468518-180dd48a579a?w=800', true),
('e08bb653-bc1a-41fa-975b-a95199ff3d93', 'NEET Biology Intensive', 'Master Botany and Zoology with NCERT-based conceptual clarity for NEET.', 'NEET', 19999, 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800', true),
('a7deb682-479b-48fe-b2e1-9987deadbeef', 'Class 10 Science Booster', 'Board-focused Science covering Physics, Chemistry, and Biology with exam strategies.', 'Foundation', 12999, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', true),
('444eadc2-a28a-49f2-8ce9-e9229df9603d', 'Foundation Course (Class 8)', 'Early preparation course building a solid conceptual foundation for future exams.', 'Foundation', 8999, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', true)
ON CONFLICT (id) DO NOTHING;
