-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  date TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Zarrar Innovations',
  content TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage all posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON public.blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default categories
INSERT INTO public.blog_categories (name) VALUES
  ('Web Development'),
  ('UI/UX Design'),
  ('E-Commerce'),
  ('Business Systems'),
  ('Mobile Apps'),
  ('Tech Trends')
ON CONFLICT (name) DO NOTHING;

-- Seed initial blog posts from existing static data
INSERT INTO public.blog_posts (title, slug, category, excerpt, read_time, date, author, content, published) VALUES
  (
    'Why Next.js is the Future of Web Development in 2026',
    'why-nextjs-future-web-development',
    'Web Development',
    'Explore why Next.js has become the framework of choice for modern web applications and how it can benefit your business.',
    '5 min read',
    'Feb 15, 2026',
    'Zarrar Innovations',
    ARRAY[
      'Next.js has rapidly evolved from a React framework into a full-stack platform that powers some of the world''s largest websites. With features like Server Components, the App Router, and built-in caching, it offers performance that was previously only achievable with custom infrastructure.',
      'One of the biggest advantages is the developer experience. Hot module replacement, TypeScript support out of the box, and automatic code splitting mean your team ships faster without sacrificing quality.',
      'For businesses, this translates to faster time-to-market, better SEO performance, and lower hosting costs thanks to edge rendering and static generation capabilities.'
    ],
    true
  ),
  (
    '10 UI/UX Principles Every Designer Should Know',
    '10-ui-ux-principles-designers',
    'UI/UX Design',
    'From visual hierarchy to accessibility, these core principles will elevate your design work to the next level.',
    '7 min read',
    'Feb 8, 2026',
    'Zarrar Innovations',
    ARRAY[
      'Great design is not just about aesthetics. It is about solving real user problems through intuitive interfaces that guide users toward their goals.',
      'Key principles like visual hierarchy, consistency, feedback, and accessibility form the foundation of every successful digital product. Mastering these principles separates good designers from great ones.',
      'In this article, we break down each principle with real-world examples and actionable tips you can apply to your next project immediately.'
    ],
    true
  ),
  (
    'Shopify vs WooCommerce: Which E-Commerce Platform Wins in 2026?',
    'shopify-vs-woocommerce-2026',
    'E-Commerce',
    'A detailed comparison of Shopify and WooCommerce to help you pick the right platform for your online store.',
    '8 min read',
    'Jan 28, 2026',
    'Zarrar Innovations',
    ARRAY[
      'Choosing the right e-commerce platform is one of the most critical decisions for any online business. Both Shopify and WooCommerce have matured significantly, but they serve different needs.',
      'Shopify excels in simplicity, managed hosting, and a vast app ecosystem. WooCommerce offers unlimited customization for those comfortable with WordPress. The right choice depends on your budget, technical capabilities, and growth plans.',
      'We compare pricing, scalability, customization, SEO capabilities, and total cost of ownership to help you make an informed decision.'
    ],
    true
  ),
  (
    'How a POS System Can Transform Your Retail Business',
    'pos-system-transform-retail',
    'Business Systems',
    'Modern POS systems do more than process payments. Learn how they can streamline your entire retail operation.',
    '4 min read',
    'Jan 18, 2026',
    'Zarrar Innovations',
    ARRAY[
      'Today''s POS systems are far more than cash registers. They are the central nervous system of modern retail, connecting inventory, sales, customer data, and analytics in real time.',
      'From automated reorder alerts to customer loyalty programs, a well-implemented POS system can reduce operational costs by 30% or more while providing the data you need to make smarter business decisions.',
      'In this guide, we explore the features that matter most and how to evaluate POS solutions for your specific industry.'
    ],
    true
  ),
  (
    'The Complete Guide to React Native Mobile App Development',
    'guide-react-native-mobile-development',
    'Mobile Apps',
    'Everything you need to know about building cross-platform mobile apps with React Native in 2026.',
    '10 min read',
    'Jan 5, 2026',
    'Zarrar Innovations',
    ARRAY[
      'React Native continues to be one of the most popular frameworks for cross-platform mobile development. With the New Architecture now stable and Expo simplifying the development workflow, building production-quality apps has never been more accessible.',
      'This guide covers everything from project setup and navigation patterns to performance optimization and App Store deployment. Whether you are building your first app or migrating from native, this comprehensive resource has you covered.',
      'We also compare React Native to Flutter and native development so you can make an informed technology choice.'
    ],
    true
  ),
  (
    'Building Scalable Management Systems: Architecture Decisions',
    'scalable-management-systems-architecture',
    'Business Systems',
    'Key architectural decisions that ensure your management system can grow with your business.',
    '6 min read',
    'Dec 20, 2025',
    'Zarrar Innovations',
    ARRAY[
      'Management systems that start small often need to scale rapidly as businesses grow. Making the right architectural decisions early can save months of refactoring later.',
      'Multi-tenancy, role-based access control, event-driven architectures, and modular service boundaries are all patterns that enable sustainable growth without performance degradation.',
      'In this article, we share lessons learned from building management systems across education, retail, and enterprise clients.'
    ],
    true
  ),
  (
    '5 AI Trends That Will Shape Software Development in 2026',
    'ai-trends-software-development-2026',
    'Tech Trends',
    'From AI-assisted coding to intelligent testing, discover the trends transforming how we build software.',
    '6 min read',
    'Dec 10, 2025',
    'Zarrar Innovations',
    ARRAY[
      'Artificial intelligence is no longer just a feature in apps. It is fundamentally changing how software is designed, developed, and maintained.',
      'AI-powered code assistants, automated testing, intelligent monitoring, and personalized user experiences are just the beginning. Teams that adopt these tools are shipping faster and with fewer bugs.',
      'We explore the five most impactful AI trends and practical ways to integrate them into your development workflow today.'
    ],
    true
  ),
  (
    'WordPress vs Custom Development: Making the Right Choice',
    'wordpress-vs-custom-development',
    'Web Development',
    'A practical comparison to help you decide between WordPress and a custom-built solution for your next project.',
    '6 min read',
    'Nov 28, 2025',
    'Zarrar Innovations',
    ARRAY[
      'The decision between WordPress and custom development is one we help clients navigate regularly. Both are valid choices, but the right answer depends on your specific requirements, budget, and long-term vision.',
      'WordPress offers speed to market, a massive plugin ecosystem, and easy content management. Custom development provides unlimited flexibility, better performance at scale, and complete ownership of your codebase.',
      'We break down the pros and cons with real cost comparisons and decision criteria to help you make the best choice for your business.'
    ],
    true
  )
ON CONFLICT (slug) DO NOTHING;
