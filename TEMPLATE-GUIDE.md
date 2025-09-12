# 📋 Presentation Template Customization Guide

This template provides a **reusable structure** for creating interactive presentations. Keep the framework, customize the content!

## 🚀 Quick Start Customization

### 1. **Update Presentation Configuration**

Edit the `presentationConfig` object in `src/PresentationTemplate.tsx`:

```typescript
const presentationConfig = {
  title: "Your Presentation Title",           // Main presentation title
  subtitle: "Subtitle or Topic Description",  // Subtitle/description
  author: "Your Name",                        // Presenter name
  course: "COURSE CODE",                      // Course identifier
  section: "Section Info (Optional)",        // Section info (optional)
  theme: {
    primary: "blue",    // blue, green, purple, red, indigo, etc.
    accent: "slate"     // Supporting color
  }
};
```

### 2. **Customize Your Slides**

Replace the example slides with your content by updating the `slides` array:

```typescript
const slides = useMemo(() => [
  { title: "Introduction", component: <TitleSlide data={presentationData} /> },
  { title: "Your Topic 1", component: <YourSlide1 /> },
  { title: "Your Topic 2", component: <YourSlide2 /> },
  { title: "Summary", component: <SummarySlide /> },
], [presentationData]);
```

## 🎨 Creating Custom Slides

### Basic Slide Template:
```typescript
const YourCustomSlide = () => (
  <Slide title="Your Slide Title">
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
      {/* Your content here */}
      <h3 className="text-xl font-semibold mb-4">Content Section</h3>
      <p className="text-slate-700">Your content...</p>
    </div>
  </Slide>
);
```

### Slide with Step Number:
```typescript
const StepSlide = () => (
  <Slide title="Step 1: Your Step">
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 bg-${presentationConfig.theme.primary}-100 rounded-lg flex items-center justify-center mr-4`}>
          <span className={`text-2xl font-bold text-${presentationConfig.theme.primary}-600`}>1</span>
        </div>
        <h3 className="text-xl font-semibold">Your Step Title</h3>
      </div>
      {/* Your step content */}
    </div>
  </Slide>
);
```

## 📦 Pre-built Components You Can Use

### 1. **Objective Box** (Green):
```typescript
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <h4 className="font-semibold text-green-800 mb-2">🎯 Objective:</h4>
  <p className="text-green-700">Your objective text...</p>
</div>
```

### 2. **Key Points Box** (Primary Theme):
```typescript
<div className={`bg-${presentationConfig.theme.primary}-50 rounded-lg p-4`}>
  <h4 className={`font-semibold text-${presentationConfig.theme.primary}-800 mb-3`}>📋 Key Points:</h4>
  <ul className={`text-${presentationConfig.theme.primary}-700 space-y-2`}>
    <li>• Point 1</li>
    <li>• Point 2</li>
    <li>• Point 3</li>
  </ul>
</div>
```

### 3. **Warning/Important Box** (Yellow):
```typescript
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important:</h4>
  <p className="text-yellow-700">Important information...</p>
</div>
```

### 4. **Two-Column Layout**:
```typescript
<div className="grid md:grid-cols-2 gap-6">
  <div className="bg-blue-50 rounded-lg p-4">
    <h4 className="font-semibold text-blue-800 mb-3">Left Column</h4>
    <p className="text-blue-700">Content...</p>
  </div>
  <div className="bg-purple-50 rounded-lg p-4">
    <h4 className="font-semibold text-purple-800 mb-3">Right Column</h4>
    <p className="text-purple-700">Content...</p>
  </div>
</div>
```

### 5. **Interactive Elements**:
```typescript
const [inputValue, setInputValue] = useState("");

<input
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  className="w-full rounded-lg border border-slate-300 px-3 py-2"
  placeholder="Your placeholder..."
/>
```

## 🎯 Built-in Features (Keep These!)

### ✅ **Automatic Features**:
- **Navigation**: Arrow keys, spacebar, tab clicking
- **Progress bar**: Shows completion percentage  
- **Fullscreen**: F key or button in top-right
- **Auto-centering tabs**: Active slide stays visible
- **Keyboard shortcuts**: All standard navigation
- **PDF download**: Available in summary slide (customize content)

### ✅ **Layout Structure**:
- **Header bar**: Course info and progress
- **Tab navigation**: Slide selection
- **Main content area**: Your slides
- **Footer**: Navigation controls and info

## 🔧 Advanced Customization

### Change Theme Colors:
Update the `theme.primary` in `presentationConfig`:
- `blue` (default)
- `green` 
- `purple`
- `red`
- `indigo`
- `pink`
- `yellow`

### Add More Slides:
1. Create your slide component
2. Add it to the `slides` array
3. The template handles the rest automatically

### Customize PDF Download:
Update the `downloadContent()` function in `SummarySlide`:
```typescript
const downloadContent = () => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();
  
  // Add your PDF content here
  doc.text("Your content...", 20, 30);
  
  const filename = `YourPresentation_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
```

## 📝 Step-by-Step Workflow

1. **Clone the template**: Copy the entire template folder
2. **Update config**: Edit `presentationConfig` with your info
3. **Replace slides**: Create your slide components
4. **Update slides array**: Add your slides to the array
5. **Test**: Run `npm run dev` to test
6. **Customize PDF**: Update the download content
7. **Deploy**: Build with `npm run build`

## 🎨 Color Reference

### Primary Color Options:
- `blue` - Professional, default
- `green` - Nature, growth
- `purple` - Creative, innovative  
- `red` - Important, urgent
- `indigo` - Deep, serious
- `pink` - Friendly, approachable

### Pre-built Color Boxes:
- **Green**: Objectives, success
- **Blue**: Instructions, information
- **Purple**: Technical details
- **Yellow**: Warnings, important notes
- **Red**: Critical information

## 🚀 Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 💡 Pro Tips

1. **Keep the structure**: Don't modify the navigation or layout logic
2. **Use consistent colors**: Stick to your chosen theme
3. **Test interactivity**: Make sure forms and buttons work
4. **Mobile-friendly**: Template is responsive by default
5. **PDF content**: Always update the PDF download with your content
6. **Backup**: Keep a clean template copy for future use

---

This template gives you professional presentations with minimal setup - just focus on your content! 🎉