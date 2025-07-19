const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create testimonials table
      db.run(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          image_path TEXT,
          rating INTEGER DEFAULT 5,
          text TEXT NOT NULL,
          project TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          image_path TEXT,
          description TEXT NOT NULL,
          year TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create blog_posts table
      db.run(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          image_path TEXT,
          author TEXT NOT NULL,
          date TEXT NOT NULL,
          category TEXT NOT NULL,
          read_time TEXT NOT NULL,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
};

// Insert default data if tables are empty
const insertDefaultData = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM testimonials", (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count === 0) {
        // Insert default testimonials
        const defaultTestimonials = [
          {
            name: "Sarah Johnson",
            role: "Homeowner",
            image_path: null,
            rating: 5,
            text: "AA Designer Studio transformed our home into a masterpiece. Their attention to detail and understanding of our vision was exceptional.",
            project: "Modern Family Home"
          },
          {
            name: "Michael Chen",
            role: "Business Owner",
            image_path: null,
            rating: 5,
            text: "The team's professionalism and creativity exceeded our expectations. They created a workspace that enhances productivity.",
            project: "Corporate Office Design"
          }
        ];

        const stmt = db.prepare(`
          INSERT INTO testimonials (name, role, image_path, rating, text, project)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        defaultTestimonials.forEach(testimonial => {
          stmt.run([
            testimonial.name,
            testimonial.role,
            testimonial.image_path,
            testimonial.rating,
            testimonial.text,
            testimonial.project
          ]);
        });

        stmt.finalize();
      }

      // Check projects
      db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          // Insert default projects
          const defaultProjects = [
            {
              title: "Modern Penthouse",
              category: "residential",
              image_path: null,
              description: "Luxury penthouse with panoramic city views",
              year: "2024"
            },
            {
              title: "Corporate Headquarters",
              category: "commercial",
              image_path: null,
              description: "Contemporary office space design",
              year: "2023"
            }
          ];

          const stmt = db.prepare(`
            INSERT INTO projects (title, category, image_path, description, year)
            VALUES (?, ?, ?, ?, ?)
          `);

          defaultProjects.forEach(project => {
            stmt.run([
              project.title,
              project.category,
              project.image_path,
              project.description,
              project.year
            ]);
          });

          stmt.finalize();
        }

        // Check blog posts
        db.get("SELECT COUNT(*) as count FROM blog_posts", (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (row.count === 0) {
            // Insert default blog posts
            const defaultBlogPosts = [
              {
                title: "The Future of Interior Design: Sustainable Living Spaces",
                excerpt: "Explore how sustainable design practices are reshaping modern interiors and creating healthier living environments for the future.",
                content: "Sustainability in interior design is no longer just a trend—it's becoming a necessity. As we face environmental challenges, designers are reimagining spaces to be both beautiful and environmentally responsible.\n\nKey sustainable practices include:\n\n• Using reclaimed and recycled materials\n• Choosing low-VOC paints and finishes\n• Incorporating energy-efficient lighting\n• Selecting furniture from sustainable sources\n• Designing for longevity rather than trends\n\nAt AA Designer Studio, we believe that sustainable design doesn't mean compromising on style. Our approach integrates eco-friendly materials with cutting-edge design principles to create spaces that are both stunning and responsible.",
                image_path: null,
                author: "Anjan & Mona",
                date: "2024-01-15",
                category: "sustainability",
                read_time: "5 min read",
                tags: JSON.stringify(["Sustainability", "Modern Design", "Eco-Friendly"])
              },
              {
                title: "Maximizing Small Spaces: Design Tips for Urban Living",
                excerpt: "Discover innovative strategies to make the most of compact living spaces without compromising on style or functionality.",
                content: "Urban living often means working with smaller spaces, but that doesn't mean sacrificing style or functionality. Here are our top strategies for maximizing small spaces:\n\n**Multi-functional Furniture**\nInvest in pieces that serve multiple purposes—ottomans with storage, expandable dining tables, and murphy beds.\n\n**Vertical Storage Solutions**\nUtilize wall space with floating shelves, tall bookcases, and wall-mounted desks.\n\n**Light and Color**\nUse light colors to make spaces feel larger, and incorporate mirrors to reflect light and create depth.\n\n**Smart Layout Planning**\nCreate zones within open spaces using furniture placement and area rugs to define different functional areas.",
                image_path: null,
                author: "Anjan & Mona",
                date: "2024-01-10",
                category: "tips",
                read_time: "4 min read",
                tags: JSON.stringify(["Small Spaces", "Urban Living", "Space Planning"])
              }
            ];

            const stmt = db.prepare(`
              INSERT INTO blog_posts (title, excerpt, content, image_path, author, date, category, read_time, tags)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            defaultBlogPosts.forEach(post => {
              stmt.run([
                post.title,
                post.excerpt,
                post.content,
                post.image_path,
                post.author,
                post.date,
                post.category,
                post.read_time,
                post.tags
              ]);
            });

            stmt.finalize();
          }

          console.log('Default data inserted successfully');
          resolve();
        });
      });
    });
  });
};

module.exports = {
  db,
  initDatabase,
  insertDefaultData
}; 