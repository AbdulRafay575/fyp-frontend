
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Shield, Clock, Award, Users, 
  CheckCircle, Sparkles, Brain, FileText, 
  Lightbulb, BookOpen, Star, MessageCircle,
  GraduationCap, Zap, Settings, BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const features = [
    { icon: <Brain className="h-5 w-5 text-primary" />, text: "AI-Powered Learning" },
    { icon: <FileText className="h-5 w-5 text-primary" />, text: "Smart Summaries" },
    { icon: <Lightbulb className="h-5 w-5 text-primary" />, text: "Exam Prep" },
    { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "Proven Results" }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.5 }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.5 }}
          className="absolute top-1/2 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.5 }}
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
        ></motion.div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.03]"></div>
      
      <div className="container relative mx-auto px-4 z-10">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Two-column layout for larger screens */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left column: Main content */}
            <motion.div className="flex-1 text-center lg:text-left" variants={fadeIn}>
              {/* Feature badge */}
              <motion.div 
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-8 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <GraduationCap className="h-3.5 w-3.5 mr-2 text-primary" />
                <span className="flex items-center text-sm font-medium text-primary">
                  Next-Generation Learning Platform
                </span>
              </motion.div>
              
              {/* Main heading with animated gradient */}
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground"
                variants={fadeIn}
              >
                Transform Your <br/>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient pb-1">Study Experience</span>
              </motion.h1>
              
              {/* Subheading */}
              <motion.p 
                className="text-xl mb-8 text-muted-foreground lg:max-w-xl"
                variants={fadeIn}
              >
                Our AI-powered platform helps you learn smarter, comprehend faster, and retain knowledge longer.
              </motion.p>
              
              {/* CTA buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12" variants={fadeIn}>
                <Button size="lg" className="relative overflow-hidden group shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <Link to="/dashboard" className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Start Learning Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm hover:bg-background/90 border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <Link to="/dashboard" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Explore Features
                  </Link>
                </Button>
              </motion.div>
              
              {/* Feature highlights */}
              <motion.div 
                className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/20 transition-all shadow-sm hover:shadow-md"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { delay: 0.2 + (index * 0.1) } 
                      }
                    }}
                  >
                    <div className="mr-3">{feature.icon}</div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Right column: Enhanced Card Stack */}
            <motion.div 
              className="flex-1 hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-xl animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-12 left-12 w-40 h-40 bg-accent/5 rounded-full blur-xl animate-blob animation-delay-2000"></div>
                
                {/* Card stack effect - Improved with more content */}
                <div className="relative max-w-md mx-auto">
                  {/* Background cards for depth effect */}
                  <div className="absolute top-8 -right-6 w-full h-[440px] bg-muted/50 rounded-2xl transform rotate-6 border border-border/30 shadow-sm"></div>
                  <div className="absolute top-4 -right-3 w-full h-[440px] bg-card/80 rounded-2xl transform rotate-3 border border-border/40 shadow-sm"></div>
                  
                  {/* Main card with enhanced content */}
                  <Card className="relative w-full h-[440px] rounded-2xl shadow-xl border border-border/60 z-10 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-80"></div>
                    
                    <CardContent className="p-8 h-full flex flex-col">
                      {/* Card header with visual tab system */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Brain className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-foreground">StudyGenius</h3>
                            <p className="text-xs text-muted-foreground">Advanced Learning</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400/70"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                        </div>
                      </div>
                      
                      {/* Tabs */}
                      <div className="flex mb-4 border-b border-border/40">
                        <div className="px-4 py-2 text-xs font-medium text-primary border-b-2 border-primary">Physics Notes</div>
                        <div className="px-4 py-2 text-xs text-muted-foreground">Recent</div>
                        <div className="px-4 py-2 text-xs text-muted-foreground">Saved</div>
                      </div>
                      
                      {/* Course content */}
                      <div className="space-y-4 mb-5">
                        <div className="flex items-center justify-between px-3 py-2 bg-primary/5 rounded-lg">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm font-medium">Quantum Physics</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary font-medium">Unit 4</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="h-4 flex items-center">
                                <span className="text-xs">Wave-particle duality</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary/80 to-accent/80 w-full rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="h-4 flex items-center">
                                <span className="text-xs">Quantum superposition</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary/80 to-accent/80 w-full rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="h-4 flex items-center">
                                <span className="text-xs">Schrödinger's equation</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary/80 to-accent/80 w-4/5 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
                            </div>
                            <div className="flex-1">
                              <div className="h-4 flex items-center">
                                <span className="text-xs text-muted-foreground">Quantum entanglement</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary/30 to-accent/30 w-1/4 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground/70">Overall Progress</span>
                          <span className="text-foreground/70 font-semibold">78%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent w-[78%] rounded-full "></div>
                        </div>
                      </div>
                      
                      {/* AI Summary section with visual enhancements */}
                      <div className="mt-auto">
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 relative overflow-hidden">
                          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-lg"></div>
                          <div className="flex items-center mb-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary mr-2" />
                            <span className="text-xs font-semibold text-foreground">AI-Generated Insights</span>
                          </div>
                          <div className="text-xs text-foreground/70">
                            Quantum mechanics describes how subatomic particles behave, introducing concepts like wave-particle duality, uncertainty principle, and quantum entanglement.
                          </div>
                          <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center">
                              <BarChart className="h-3 w-3 mr-1 text-primary" />
                              Mastery Level: High
                            </span>
                            <span className="flex items-center">
                              <Lightbulb className="h-3 w-3 mr-1 text-amber-400" />
                              12 Practice Questions
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interaction stats with improved styling */}
                      <div className="flex justify-between mt-4 text-xs">
                        <div className="flex items-center bg-black/5 rounded-full px-2 py-1">
                          <Clock className="h-3 w-3 mr-1 text-primary" />
                          <span>Study time: 3h 45m</span>
                        </div>
                        <div className="flex items-center bg-black/5 rounded-full px-2 py-1">
                          <Star className="h-3 w-3 mr-1 text-amber-400 fill-amber-400" />
                          <span>4.8/5.0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Floating elements for visual interest */}
                  <motion.div 
                    className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent/10 rounded-full blur-lg"
                    animate={{ 
                      scale: [1, 1.2, 1], 
                      opacity: [0.5, 0.8, 0.5] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute -top-2 -left-2 w-16 h-16 bg-primary/10 rounded-full blur-lg"
                    animate={{ 
                      scale: [1, 1.3, 1], 
                      opacity: [0.6, 0.9, 0.6] 
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1 
                    }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Trust indicators with improved styling */}
          <motion.div 
            className="mt-20 pt-10 border-t border-border/30 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-border/30 mb-6 shadow-sm">
              <Users className="h-3.5 w-3.5 mr-2 text-primary" />
              <p className="text-sm text-foreground/80">Trusted by <span className="font-semibold text-foreground">10,000+</span> students worldwide</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5">
                <Shield className="h-4 w-4 mr-2" /> Secure & Private
              </div>
              <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5">
                <Clock className="h-4 w-4 mr-2" /> 24/7 Availability
              </div>
              <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5">
                <Award className="h-4 w-4 mr-2" /> Top-rated AI
              </div>
              <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5">
                <Star className="h-4 w-4 mr-2 fill-amber-400 text-amber-400" /> 4.8 Average Rating
              </div>
              <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5">
                <MessageCircle className="h-4 w-4 mr-2" /> 24/7 Support
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
