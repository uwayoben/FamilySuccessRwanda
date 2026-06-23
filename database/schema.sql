-- FSR Website Database Schema
-- Run this in XAMPP phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS fsr_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fsr_website;

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  donation_type ENUM('general', 'education', 'healthcare', 'faina_jerusalem', 'women_empowerment', 'children', 'youth') DEFAULT 'general',
  message TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(100),
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1
);

-- Programs table (for dynamic content management)
CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed programs
INSERT INTO programs (title, slug, description, icon, display_order) VALUES
('Education Support', 'education-support', 'Targeting children and youth from the most vulnerable families with quality education, primary skills, technical skills, human rights, and life skills education. We build and equip schools to ensure access to quality education.', 'graduation-cap', 1),
('Women & Community Empowerment', 'women-empowerment', 'Training women in mindset change, entrepreneurship, income generation, vision building, conflict management, nutrition, and hygiene. Our primary approach uses Village Savings and Loans Associations (VSLAs).', 'users', 2),
('Youth Capacity Building', 'youth-capacity', 'Career guidance, job creation, and saving schemes for youth. We use VSLAs to coach youth grouped in newly created associations, training them in entrepreneurship and business literacy.', 'trending-up', 3),
('Children Empowerment', 'children-empowerment', 'Giving children an active role in their own holistic development, building shelters for homeless children, paying school fees for vulnerable students, and providing nutritional support and domestic materials.', 'heart', 4),
('Healthcare', 'healthcare', 'Healthcare outreach and medical clinics serving underserved rural communities, bringing essential medical care to those who need it most.', 'activity', 5),
('Family Strengthening', 'family-strengthening', 'Parenting education, savings groups, community development initiatives, and supporting teen mothers with vocational training and life skills for sustainable family wellbeing.', 'home', 6);
