import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Camera, BarChart3, Activity, Sparkles, Apple, Heart, Shield, Leaf, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

const features = [
  {
    icon: Camera,
    title: 'Snap & Analyze',
    description: 'Photograph your meal and our AI instantly identifies every ingredient.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Deep Insights',
    description: 'Get comprehensive nutritional breakdown including all macros.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Activity,
    title: 'Track Progress',
    description: 'Beautiful visualizations help you understand your eating patterns.',
    gradient: 'from-cyan-500 to-emerald-500',
  },
];

const benefits = [
  'AI-powered food recognition',
  'Personalized meal recommendations',
  'Track macros & micronutrients',
  'Set and achieve health goals',
];

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NutriVision</span>
          </div>
          <Button
            variant="ghost"
            onClick={onLogin}
            className="text-foreground/80 hover:text-foreground hover:bg-primary/10"
          >
            Sign In
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" 
          />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                y: [0, -30, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 6 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5
              }}
              className="absolute"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + i * 15}%`,
              }}
            >
              <Leaf className={`w-${4 + i * 2} h-${4 + i * 2} text-primary/30`} style={{ width: 16 + i * 8, height: 16 + i * 8 }} />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Nutrition Tracking</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Your Personal
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                  Nutrition Expert
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full origin-left"
                />
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Transform your health journey with AI that understands your food. 
              Snap, track, and achieve your nutrition goals effortlessly.
            </motion.p>

            {/* Benefits list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50"
                >
                  <Check className="w-4 h-4 text-primary" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="group w-full sm:w-auto text-base px-8 py-6 rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onLogin}
                className="w-full sm:w-auto text-base px-8 py-6 rounded-full border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/50 transition-all"
              >
                Already have an account?
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
          >
            <motion.div 
              animate={{ opacity: [1, 0.3, 1], y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-primary rounded-full" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
        
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-4 text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full"
            >
              <Zap className="w-4 h-4" />
              How It Works
            </motion.span>
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Three Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our intuitive AI-powered system
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full overflow-hidden rounded-3xl bg-card border border-border/50 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30">
                  {/* Step number */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
                </div>

                {/* Connector line (hidden on mobile and last item) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="inline-flex items-center gap-2 mb-4 text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              Features
            </span>
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help you achieve your health goals
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Apple, title: 'Food Recognition', desc: 'AI identifies thousands of foods instantly', color: 'text-red-500' },
              { icon: Heart, title: 'Health Alerts', desc: 'Allergen detection for your safety', color: 'text-pink-500' },
              { icon: BarChart3, title: 'Macro Tracking', desc: 'Protein, carbs, fats at a glance', color: 'text-blue-500' },
              { icon: Activity, title: 'Progress Charts', desc: 'Visualize your nutrition journey', color: 'text-emerald-500' },
              { icon: Shield, title: 'Privacy First', desc: 'Your data is encrypted & secure', color: 'text-amber-500' },
              { icon: Sparkles, title: 'AI Insights', desc: 'Personalized nutrition recommendations', color: 'text-purple-500' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-primary-glow p-10 sm:p-16 text-center shadow-2xl"
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -right-1/2 w-full h-full border border-primary-foreground/10 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/2 -left-1/2 w-full h-full border border-primary-foreground/10 rounded-full" 
              />
              <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Leaf className="w-4 h-4" />
                Start Today
              </motion.div>
              
              <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">
                Ready to Transform
                <br />
                Your Health?
              </h2>
              <p className="mb-10 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                Join thousands who have taken control of their nutrition journey with AI-powered insights.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="group text-base sm:text-lg px-10 py-7 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl font-semibold"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">NutriVision</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            AI-powered nutrition tracking for a healthier you.
          </p>
        </div>
      </footer>
    </div>
  );
}
