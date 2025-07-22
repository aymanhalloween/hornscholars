# Horn Scholars Digital Platform

The definitive digital archive of 600+ years of Somali Islamic scholarship, transforming the Arabic biographical dictionary Mu'jam al-Mu'allifīn al-Ṣūmāliyyīn into an interactive, multilingual, scholar-first digital experience.

## 🎯 Vision

Building an elegant, fast, and beautifully designed full-stack web app with Apple-level visual polish that serves as the living map of knowledge for Horn of Africa Islamic heritage.

## ✨ Features

### MVP (Current)
- **Multilingual Search**: Support for Arabic, English, and Somali with advanced fuzzy matching
- **Scholar Profiles**: Comprehensive biographical information with structured data
- **Professional Design**: Clean, academic-focused UI inspired by modern design principles
- **Responsive Design**: Mobile-first approach with elegant desktop scaling

### Upcoming
- **Network Visualization**: Interactive D3.js-powered scholar relationship graphs
- **Geographic Mapping**: Visual journey maps showing scholar movements
- **Timeline Views**: Track intellectual movements across centuries
- **Advanced Filters**: Filter by location, school of thought, subject, century

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **UI Components**: Radix UI primitives with custom design system
- **Search**: PostgreSQL full-text search with fuzzy matching
- **Visualization**: D3.js (planned)
- **Deployment**: Vercel
- **Styling**: Custom design tokens with professional color system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aymanhalloween/hornscholars.git
   cd hornscholars
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - This will create all tables, relationships, and sample data

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📊 Database Schema

The application uses a relational schema with the following main tables:

- **scholars**: Core scholar information (names, dates, biography, specializations)
- **locations**: Geographic locations with coordinates
- **relationships**: Scholar-to-scholar connections (teacher/student, contemporaries)
- **scholar_locations**: Junction table linking scholars to places they lived/studied

## 🎨 Design System

### Color Palette
- **Primary**: Professional academic blue (#2563eb)
- **Accent**: Manuscript amber (#d97706) 
- **Neutrals**: Sophisticated gray scale for readability
- **Typography**: Inter (Latin) + Noto Sans Arabic (Arabic/Somali)

### Principles
- **Typography-first**: Content hierarchy through intentional font scaling
- **Generous whitespace**: Clean, uncluttered layouts
- **Consistent spacing**: 8px grid system
- **Purposeful color**: Maximum 3 colors per screen
- **Accessibility**: WCAG 2.1 compliance

## 🔍 Search Features

- **Fuzzy Matching**: Handles name variations (Ibrahim vs Ibraahim vs إبراهيم)
- **Multilingual**: Search across Arabic, English, and Somali names
- **Full-text**: Biography and specialization text search
- **Relevance Scoring**: Intelligent ranking of search results
- **Instant Results**: Real-time search as you type

## 📱 Responsive Design

- **Mobile-first**: Optimized for scholars accessing on mobile devices
- **Tablet-friendly**: Enhanced layouts for medium screens
- **Desktop-rich**: Full feature set with advanced visualizations

## 🤝 Contributing

This is a cultural preservation project. Contributions are welcome, especially from:
- Islamic studies scholars
- Digital humanities experts  
- Horn of Africa community members
- Frontend/backend developers

### Development Guidelines
- Follow the established design system
- Write TypeScript for type safety
- Add proper error handling
- Test on multiple screen sizes
- Respect the scholarly nature of the content

## 📚 Academic Context

This platform digitizes and makes accessible the intellectual heritage of Somali Islamic scholarship, including:

- **Fiqh** (Islamic jurisprudence) scholars
- **Hadith** experts and collectors
- **Sufism** masters and their chains of transmission
- **Arabic literature** and poetry
- **Astronomy** and **mathematics** scholars
- **Women scholars** in Islamic sciences

## 🌍 Impact Goals

- **Academic Citation**: Referenced in scholarly journals
- **Educational Resource**: Used in classrooms globally
- **Cultural Preservation**: Accessible archive for diaspora communities
- **Research Foundation**: Inspire similar projects for other Islamic regions

## 📄 License

This project is dedicated to preserving and sharing Islamic scholarly heritage. See LICENSE file for details.

## 🙏 Acknowledgments

- Based on the biographical dictionary Mu'jam al-Mu'allifīn al-Ṣūmāliyyīn
- Horn of Africa Islamic studies scholars and historians
- The broader digital humanities community

---

**Built with ❤️ for preserving 600+ years of Islamic scholarship from the Horn of Africa**