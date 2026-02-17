import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Brain, Trophy, Target, Sparkles, ArrowRight, Users, Star, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/effects/ThemeToggle";
import { KineticText } from "@/components/effects/KineticText";
import { LiquidGlassCard } from "@/components/effects/LiquidGlassCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects/ScrollReveal";
import { MicroInteractionButton } from "@/components/effects/MicroInteractionButton";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import amreshImage from "@/assets/amresh-singh.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Trophy,
    title: "Track Your Progress",
    description: "Monitor your streak, completion rate, and identify areas for improvement",
    gradient: "from-warning to-orange-400",
    glow: "warning" as const,
  },
  {
    icon: Target,
    title: "Diverse Categories",
    description: "From Python to general knowledge—explore multiple quiz categories",
    gradient: "from-primary to-accent",
    glow: "primary" as const,
  },
  {
    icon: Sparkles,
    title: "Create & Share",
    description: "Build custom quizzes and challenge your friends or study group",
    gradient: "from-success to-emerald-400",
    glow: "success" as const,
  },
];

const stats = [
  { value: "10K+", label: "Active Learners" },
  { value: "50+", label: "Quiz Categories" },
  { value: "1000+", label: "Questions" },
  { value: "95%", label: "Satisfaction" },
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with Parallax - Mobile optimized height */}
      <section ref={heroRef} className="relative min-h-[600px] md:min-h-screen flex items-center py-16">
        {/* Animated Background with Liquid Morphing */}
        <div className="absolute inset-0 gradient-hero opacity-95" />

        {/* 3D WebGL Particle Background */}
        <ParticleBackground className="z-[1] opacity-80" />

        {/* Morphing blob background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%]"
            style={{
              background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.2) 0%, transparent 50%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%]"
            style={{
              background: "radial-gradient(ellipse at center, hsl(var(--accent) / 0.15) 0%, transparent 50%)",
            }}
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [0, -5, 0],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: `hsl(var(--background) / ${0.1 + Math.random() * 0.3})`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Header with Theme Toggle - Liquid Glass */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="liquid-glass rounded-full p-1">
                <ThemeToggle />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Content with Parallax */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative max-w-6xl mx-auto px-4 py-16 md:py-28 z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            {/* Logo with Liquid Glass */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <div className="liquid-glass p-5 rounded-3xl">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-14 w-14" />
                </motion.div>
              </div>
              <motion.h1
                className="text-5xl md:text-6xl font-black text-shimmer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                MakeAQuiz
              </motion.h1>
            </motion.div>

            {/* Kinetic Typography Headline */}
            <div className="mb-8">
              <KineticText
                text="Challenge Your Mind"
                variant="hero"
                className="text-white mb-2"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white/95 text-on-gradient block">
                  Master Any Subject
                </span>
              </motion.div>
            </div>

            {/* Subheadline with improved contrast */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl text-white/95 text-on-gradient max-w-2xl mx-auto mb-12"
            >
              Interactive quizzes designed to help you learn, compete, and excel.
              Track your progress, beat your best scores, and become a master!
            </motion.p>

            {/* CTA Buttons with Micro-interactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MicroInteractionButton
                onClick={onGetStarted}
                variant="glass"
                size="lg"
                className="bg-white/95 text-primary hover:bg-white font-bold px-10 py-7 text-lg shadow-2xl"
              >
                <Play className="h-5 w-5" />
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </MicroInteractionButton>

              <MicroInteractionButton
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="glass"
                size="lg"
                className="text-white border-2 border-white/30"
              >
                Learn More
              </MicroInteractionButton>
            </motion.div>
          </motion.div>

          {/* Floating Category Tags - Decorative */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex justify-center gap-4 flex-wrap"
            role="presentation"
            aria-hidden="true"
          >
            {['Python', 'JavaScript', 'Web Dev', 'GK', 'Data Science'].map((label, i) => (
              <motion.div
                key={label}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, i % 2 === 0 ? 2 : -2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="liquid-glass px-6 py-3 rounded-full text-white font-medium"
              >
                {label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section with Scroll Reveal */}
      <section className="py-20 bg-background relative">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <LiquidGlassCard
                  className="text-center p-8 hover:scale-105 transition-transform"
                  glowColor="primary"
                >
                  <motion.div
                    className="text-5xl md:text-6xl font-black kinetic-text mb-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </LiquidGlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section with Scrollytelling */}
      <section id="features" className="py-24 bg-muted/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal variant="cinematic" className="text-center mb-20">
            <motion.span
              className="inline-block px-5 py-2 rounded-full liquid-glass text-primary text-sm font-semibold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              ✨ Features
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="kinetic-text">MakeAQuiz</span>?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to enhance your learning journey
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <ScrollReveal
                key={feature.title}
                variant="slide-up"
                delay={i * 0.15}
              >
                <LiquidGlassCard
                  className="h-full group overflow-hidden"
                  glowColor={feature.glow}
                >
                  {/* Gradient top line */}
                  <motion.div
                    className={`h-1.5 bg-gradient-to-r ${feature.gradient}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  />
                  <div className="p-8 text-center relative">
                    <motion.div
                      className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-xl`}
                      whileHover={{
                        rotate: [0, -10, 10, 0],
                        scale: 1.15,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <h4 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </LiquidGlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-background relative">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal variant="cinematic" className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Trusted by Learners Worldwide
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Join 10,000+ learners already mastering their skills
            </h3>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
            {[
              { name: "Rahul S.", role: "Student", text: "MakeAQuiz helped me ace my exams! The interactive format keeps me engaged." },
              { name: "Priya M.", role: "Developer", text: "Love the coding quizzes. Very helpful for interview prep!" },
              { name: "Amit K.", role: "Teacher", text: "Great tool for creating custom quizzes for my students." },
            ].map((testimonial) => (
              <StaggerItem key={testimonial.name}>
                <LiquidGlassCard className="h-full" glowColor="accent">
                  <div className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ delay: j * 0.1, type: "spring" }}
                        >
                          <Star className="h-5 w-5 fill-warning text-warning" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </LiquidGlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA with Scrollytelling */}
      <section className="py-28 gradient-hero text-white relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <ScrollReveal variant="cinematic">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="h-16 w-16 mx-auto mb-8 text-warning" />
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
              Join thousands of learners and start mastering new skills today.
              It's completely free to get started!
            </p>
            <MicroInteractionButton
              onClick={onGetStarted}
              variant="glass"
              size="lg"
              className="bg-white text-primary hover:bg-white/95 font-bold text-xl px-12 py-8 shadow-2xl"
            >
              Start Learning Now
              <ArrowRight className="h-6 w-6" />
            </MicroInteractionButton>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer with Creator Info */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">MakeAQuiz.in</span>
            </motion.div>

            {/* Creator Section with Liquid Glass */}
            <LiquidGlassCard className="p-1" glowColor="primary">
              <div className="flex items-center gap-4 p-4">
                <motion.img
                  src={amreshImage}
                  alt="Amresh Singh"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <div>
                  <p className="text-sm text-muted-foreground">Service by</p>
                  <p className="font-bold text-xl text-foreground">Amresh Singh</p>
                </div>
              </div>
            </LiquidGlassCard>

            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} MakeAQuiz.in. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
