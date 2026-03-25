@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 230 25% 10%;

    --card: 0 0% 97%;
    --card-foreground: 230 25% 10%;

    --popover: 0 0% 97%;
    --popover-foreground: 230 25% 10%;

    --primary: 190 90% 40%;
    --primary-foreground: 0 0% 100%;

    --secondary: 270 60% 55%;
    --secondary-foreground: 0 0% 100%;

    --muted: 220 14% 92%;
    --muted-foreground: 215 16% 47%;

    --accent: 190 90% 40%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 13% 87%;
    --input: 220 13% 87%;
    --ring: 190 90% 40%;

    --radius: 0.75rem;

    --sidebar-background: 0 0% 96%;
    --sidebar-foreground: 230 25% 10%;
    --sidebar-primary: 190 90% 40%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 14% 92%;
    --sidebar-accent-foreground: 230 25% 10%;
    --sidebar-border: 220 13% 87%;
    --sidebar-ring: 190 90% 40%;

    --gradient-primary: linear-gradient(135deg, hsl(190 90% 40%), hsl(270 60% 55%));
    --gradient-card: linear-gradient(135deg, hsl(0 0% 97% / 0.8), hsl(0 0% 94% / 0.6));
    --glass-bg: hsl(0 0% 100% / 0.6);
    --glass-border: hsl(230 25% 10% / 0.08);
    --glow-primary: 0 0 30px hsl(190 90% 40% / 0.2);
    --glow-secondary: 0 0 30px hsl(270 60% 55% / 0.2);
  }

  .dark {
    --background: 230 25% 7%;
    --foreground: 210 40% 96%;

    --card: 230 20% 12%;
    --card-foreground: 210 40% 96%;

    --popover: 230 20% 12%;
    --popover-foreground: 210 40% 96%;

    --primary: 190 90% 50%;
    --primary-foreground: 230 25% 7%;

    --secondary: 270 60% 55%;
    --secondary-foreground: 210 40% 96%;

    --muted: 230 15% 18%;
    --muted-foreground: 215 20% 55%;

    --accent: 190 90% 50%;
    --accent-foreground: 230 25% 7%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 210 40% 98%;

    --border: 230 15% 20%;
    --input: 230 15% 20%;
    --ring: 190 90% 50%;

    --sidebar-background: 230 20% 10%;
    --sidebar-foreground: 210 40% 96%;
    --sidebar-primary: 190 90% 50%;
    --sidebar-primary-foreground: 230 25% 7%;
    --sidebar-accent: 230 15% 18%;
    --sidebar-accent-foreground: 210 40% 96%;
    --sidebar-border: 230 15% 20%;
    --sidebar-ring: 190 90% 50%;

    --gradient-primary: linear-gradient(135deg, hsl(190 90% 50%), hsl(270 60% 55%));
    --gradient-card: linear-gradient(135deg, hsl(230 20% 14% / 0.8), hsl(230 20% 10% / 0.6));
    --glass-bg: hsl(230 20% 14% / 0.4);
    --glass-border: hsl(210 40% 96% / 0.08);
    --glow-primary: 0 0 30px hsl(190 90% 50% / 0.3);
    --glow-secondary: 0 0 30px hsl(270 60% 55% / 0.3);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', sans-serif;
  }
}

@layer components {
  .glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-border {
    position: relative;
    background: var(--glass-bg);
    border-radius: var(--radius);
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: var(--gradient-primary);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .hover-glow {
    @apply transition-all duration-300;
  }
  .hover-glow:hover {
    box-shadow: var(--glow-primary);
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .animate-slide-up {
    animation: slideUp 0.6s ease-out forwards;
  }
  .animate-scale-in {
    animation: scaleIn 0.4s ease-out forwards;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
