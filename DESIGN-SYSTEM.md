# Morning Reset Design System

**Project:** Morning Reset Tool  
**Created:** 2026-02-23  
**Status:** Phase 2 Complete  
**Next Phase:** Phase 3 (Architecture)

---

## Overview

This design system provides warm, calming visual language and UX patterns for building the Morning Reset habit formation application. The system is built with Next.js + React + TypeScript + Tailwind CSS + shadcn/ui.

---

## Visual Language

### Color Palette

**Primary - Sunrise Inspired**
- **Sunrise Orange:** `#F59E0B` - Primary actions, headers
- **Sunrise Amber:** `#FFA500` - Secondary actions, accents  
- **Sunrise Gold:** `#FFD700` - Achievements, highlights

**Secondary - Fresh & Calm**
- **Soft Teal:** `#10B981` - Success states
- **Fresh Green:** `#4ADE80` - Completed actions
- **Calm Sage:** `#A7F3D0` - Background accents

**Backgrounds - Warm & Comforting**
- **Cream Background:** `#FFFBEB` - Primary background
- **Warm Yellow:** `#FEF3C7` - Secondary background
- **Soft Orange:** `#FFF7ED` - Card backgrounds

**Text Colors**
- **Warm Dark:** `#1F2937` - Primary text
- **Warm Medium:** `#4B5563` - Secondary text
- **Warm Light:** `#6B7280` - Accent text

### Gradients

**Sunrise Gradient** - Primary actions
```css
background: linear-gradient(135deg, #FF9F43 0%, #FFA500 25%, #F59E0B 50%, #FFD700 75%, #FF9F43 100%);
```

**Soft Sunrise Gradient** - Backgrounds
```css
background: linear-gradient(135deg, rgba(255, 255, 250, 0.95) 0%, rgba(255, 253, 229, 0.95) 50%, rgba(255, 247, 237, 0.95) 100%);
```

**Success Gradient** - Completed states
```css
background: linear-gradient(135deg, #10B981 0%, #4ADE80 100%);
```

### Typography

**Font Stack**
- **Headings:** Geist Sans (rounded, friendly) - font-weight: 800
- **Body:** Inter (clean, readable) - font-weight: 400
- **Display:** Geist Mono (monospace for data) - font-weight: 600

**Sizing**
- **Hero Text:** 2rem - 3rem (mobile - desktop)
- **Body Text:** 1rem - 1.25rem
- **Small Text:** 0.875rem - 1rem

### Shadows & Effects

**Sunrise Shadow**
```css
box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3), 0 2px 4px -1px rgba(245, 158, 11, 0.2);
```

**Soft Shadow**
```css
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
```

---

## Components

### Core Features

#### 1. LandingHero
**Location:** `components/features/LandingHero.tsx`
**Purpose:** Hero section for landing page
**Props:** None
**Features:**
- Sunrise gradient background
- Animated sunrise icon
- Four benefit cards
- Primary CTA button
- Social proof

**Usage:**
```tsx
<LandingHero />
```

#### 2. DailyCheckIn
**Location:** `components/features/DailyCheckIn.tsx`
**Purpose:** Daily habit formation interface
**Props:**
- `streak: number` - Current streak count
- `longestStreak: number` - Longest streak achieved
- `onCheckIn: (wakeTime: string) => void` - Callback on successful check-in

**Features:**
- Streak display (current + longest)
- Time selection for wake-up time
- Optional activity selection
- Achievement badges (7/14/30 days)
- Success feedback animations

**Usage:**
```tsx
<DailyCheckIn 
  streak={5} 
  longestStreak={12} 
  onCheckIn={(time) => console.log(time)} 
/>
```

#### 3. ProgressDashboard
**Location:** `components/features/ProgressDashboard.tsx`
**Purpose:** Visual progress tracking across time
**Props:**
- `days: DayData[]` - Array of completed days
- `currentStreak: number` - Current consecutive days
- `longestStreak: number` - Longest streak achieved

**Features:**
- Stats overview (current streak, best streak, completion rate)
- Weekly calendar view with visual indicators
- Monthly progress grid
- Achievement badges section

**Usage:**
```tsx
<ProgressDashboard 
  days={mockDays} 
  currentStreak={5} 
  longestStreak={12} 
/>
```

#### 4. MorningLayout
**Location:** `components/layouts/MorningLayout.tsx`
**Purpose:** Main app layout with navigation
**Props:**
- `children: ReactNode` - Main content
- `className?: string` - Additional styling

**Features:**
- Navigation bar with logo
- Responsive design
- Footer with branding
- Background gradient

**Usage:**
```tsx
<MorningLayout>
  <YourContent />
</MorningLayout>
```

### UI Components (shadcn/ui)

Using shadcn/ui components with custom styling:
- **Button:** Styled with sunrise gradient
- **Card:** Custom styling with soft shadows and background blur
- **Input:** Custom styling with warm colors

---

## UX Principles

### 1. Frictionless First-Time Experience
- Email signup only (no password)
- Clear value proposition above the fold
- 60-second onboarding flow
- Trust indicators (social proof)

### 2. Habit Formation Focus
- Immediate celebration on check-in
- Visible streak counter
- Forgiving design (no guilt-tripping)
- Achievement system (7/14/30 days)

### 3. Mobile-First Design
- Optimized for phone-first usage
- Thumb-accessible touch targets (44px minimum)
- Support for in-bed usage
- Dark mode compatibility

### 4. Calming Visual Language
- Warm, encouraging colors
- Smooth animations (no jarring transitions)
- Clear visual hierarchy
- Accessible contrast ratios

---

## Styling

### CSS Structure
```
styles/
└── morning-theme.css    # Custom CSS variables and theme styles
```

### Using Custom Colors
```css
/* Use in CSS */
.my-element {
  background-color: var(--sunrise-orange);
  color: var(--warm-dark);
}
```

### Using Tailwind Classes
```tsx
// Use in React components
<div className="sunrise-gradient text-white font-bold py-4 px-6 rounded-2xl">
  Morning Reset
</div>
```

---

## Development Setup

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Package Manager:** npm

### Running the App
```bash
cd projects/morning-reset/workspace/morning-reset
npm run dev
```

### Adding New Components
1. Create component in `components/features/` or `components/layouts/`
2. Follow existing naming conventions (PascalCase)
3. Use Tailwind classes for styling
4. Document in this design system

---

## Files Created

### Phase 2 Deliverables

1. **LandingHero.tsx** - Hero section with sunrise theme
2. **DailyCheckIn.tsx** - Daily habit formation interface  
3. **ProgressDashboard.tsx** - Visual progress tracking
4. **MorningLayout.tsx** - Main app layout
5. **morning-theme.css** - Custom color palette and gradients
6. **UX-PRINCIPLES.md** - UX writing guidelines and principles
7. **DESIGN-SYSTEM.md** - Complete design system documentation

### Project Structure
```
projects/morning-reset/
├── phase2-handoff.md          # Design requirements
├── workspace/
│   └── morning-reset/
│       ├── app/
│       │   ├── page.tsx        # Landing page (LandingHero)
│       │   ├── dashboard/     # Dashboard with DailyCheckIn + ProgressDashboard
│       │   └── globals.css    # Global styles + theme import
│       ├── components/
│       │   ├── features/      # Feature components
│       │   ├── layouts/       # Layout components
│       │   └── ui/            # shadcn/ui components
│       ├── styles/
│       │   └── morning-theme.css
│       ├── UX-PRINCIPLES.md
│       └── DESIGN-SYSTEM.md
└── STATUS.md                  # Updated with Phase 2 completion
```

---

## Next Phase: Phase 3 (Architecture)

**Deliverable:** Complete technical architecture document
**Tasks:**
1. Database schema design (Supabase)
2. API routes planning
3. State management strategy
4. Testing approach
5. Deployment architecture

**Timeline:** 1-2 days
**Agent:** Blade (Technical lead)

---

## Current Status

**Phase 2: Design System** ✅ COMPLETE
- **Duration:** ~2 hours implementation
- **Delivered:** Complete design system with 4 core components
- **Ready:** Architecture phase (Phase 3)
- **Files Created:** 6 core components, 2 documentation files

**Progress:** Phase 0 ✅ → Phase 1 ✅ → Phase 2 ✅ → Phase 3 🟡

---

*Design System Complete: 2026-02-23*  
*Ready for Phase 3: Architecture*