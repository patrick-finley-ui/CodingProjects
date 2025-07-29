"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Mail, Phone, Github, Linkedin, ExternalLink, User, Briefcase, GraduationCap, MessageCircle, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function Home() {
  const [activeExperience, setActiveExperience] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("bio")

  const toggleExperience = (id: string) => {
    if (activeExperience === id) {
      setActiveExperience(null)
    } else {
      setActiveExperience(id)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume/Patrick_Finley_Resume.txt'
    link.download = 'Patrick_Finley_Resume.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["bio", "experience", "education", "connect"]
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <img
                src="/images/patrick-headshot.jpg"
                alt="Patrick Finley"
                className="w-full h-full object-cover rounded-full"
              />
            </Avatar>
            <span className="font-bold">Patrick Finley</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Projects
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Experience
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Skills
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Contact
            </a>
          </nav>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex bg-transparent gap-2" 
            onClick={downloadResume}
          >
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
          <Button variant="outline" size="icon" className="md:hidden bg-transparent">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <nav className="flex items-center justify-center gap-8 py-3">
            <button
              onClick={() => scrollToSection("bio")}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600",
                activeSection === "bio" ? "text-emerald-600" : "text-muted-foreground",
              )}
            >
              <User className="h-4 w-4" />
              Bio
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600",
                activeSection === "experience" ? "text-blue-600" : "text-muted-foreground",
              )}
            >
              <Briefcase className="h-4 w-4" />
              Experience
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-600",
                activeSection === "education" ? "text-purple-600" : "text-muted-foreground",
              )}
            >
              <GraduationCap className="h-4 w-4" />
              Education & Skills
            </button>
            <button
              onClick={() => scrollToSection("connect")}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-orange-600",
                activeSection === "connect" ? "text-orange-600" : "text-muted-foreground",
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Connect
            </button>
          </nav>
        </div>
      </div>

      <main className="container py-12 md:py-24">
        <motion.section
          id="bio"
          className="space-y-6 pb-12 md:pb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-emerald-600">
                Patrick Finley
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                I like to think of myself as a foxhole guy— or at least try to be — might not be the best at any one thing, but always willing and able to get my hands dirty with whatever the team needs. I work at the intersection of automation, AI, and agents to help organizations remove manual work, drive insights, and modernize the way work gets done.
              </p>  
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Whether it’s solving problems for the Department of Defense or tracking and optimizing parts of my own life, I’m driven by experimentation, impact, and continuous improvement. I thrive in environments where adaptability, curiosity, and momentum matter more than titles.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  Agents
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  UiPath
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Appian
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  RPA
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  AI
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Sales Engineering
                </Badge>
              </div>
              <div className="flex gap-4">
                <Button size="sm" className="gap-2" onClick={() => scrollToSection("connect")}>
                  <Mail className="h-4 w-4" />
                  Contact Me
                </Button>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Phone className="h-4 w-4" />
                  (484) 682-9054
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/50 opacity-75 blur"></div>
              <Avatar className="h-40 w-40 border-4 border-background relative">
                <img
                  src="/images/patrick-headshot.jpg"
                  alt="Patrick Finley"
                  className="w-full h-full object-cover rounded-full"
                />
              </Avatar>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="experience"
          className="space-y-6 py-12 md:py-24"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-blue-600">Professional Experience</h2>
            <p className="text-muted-foreground">My professional journey and accomplishments</p>
          </div>

          <motion.div variants={item} className="mt-8">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader
                className={cn(
                  "cursor-pointer bg-gradient-to-r from-primary/10 to-primary/5",
                  activeExperience === "uipath" && "border-b",
                )}
                onClick={() => toggleExperience("uipath")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md group">
                      <img
                        src="/logos/uipath-logo.png"
                        alt="UiPath Logo"
                        className="w-10 h-10 object-contain transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                    <div>
                      <CardTitle>UiPath</CardTitle>
                      <CardDescription>Sales Engineer II | March 2025 - Present</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        Leading AI-powered automation platform for enterprise digital transformation
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 transition-transform", activeExperience === "uipath" && "rotate-180")}
                  />
                </div>
              </CardHeader>
              {activeExperience === "uipath" && (
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Serve as the Lead Sales Engineer for the U.S. Air Force and major federal systems integrators, with contributions on track to drive over $3M in net-new software revenue through strategic pre-sales engagements</li>
                    <li>Drive adoption of agentic automation by designing and presenting tailored automation journeys, including recorded demos showcasing end-to-end AI, RPA, and IDP workflows</li>
                    <li>Architect technical solutions using AI agents, robotic process automation (RPA), and intelligent document processing (IDP) that collectively eliminate hundreds of thousands of manual labor hours across finance, procurement, and HR domains</li>
                    <li>Support platform expansion by aligning UiPath capabilities with key federal missions—emphasizing audit readiness, compliance automation, and resource optimization</li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </motion.div>

          <motion.div variants={item} className="mt-4">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader
                className={cn(
                  "cursor-pointer bg-gradient-to-r from-primary/10 to-primary/5",
                  activeExperience === "appian-sc" && "border-b",
                )}
                onClick={() => toggleExperience("appian-sc")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md group">
                      <img
                        src="/logos/appian-logo.png"
                        alt="Appian Logo"
                        className="w-10 h-8 object-contain transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                    <div>
                      <CardTitle>Appian</CardTitle>
                      <CardDescription>Solutions Consultant | May 2023 - March 2025</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        Low-code automation platform for business process management and workflow optimization
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 transition-transform", activeExperience === "appian-sc" && "rotate-180")}
                  />
                </div>
              </CardHeader>
              {activeExperience === "appian-sc" && (
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Lead Sales Engineer for the company's largest account by ACV—$17M Army account projected by EOY 2025</li>
                    <li>Captured a $1.4M ACV deal for Army Foreign Military Sales by leading the pursuit with an implementation partner across a 12 month OTA process</li>
                    <li>Developed and delivered key demos and solution frameworks, enhancing the broader Solutions Consulting team's capabilities across various use cases, including IT Marketplace, Field Service Management, Case Management, and Workload Management</li>
                    <li>Pioneered Appian's first solution use case for Disconnected, Denied, Intermittent, and Limited (DDIL) environments, enabling real-time logistics status reporting for the U.S. Army</li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </motion.div>

          <motion.div variants={item} className="mt-4">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader
                className={cn(
                  "cursor-pointer bg-gradient-to-r from-primary/10 to-primary/5",
                  activeExperience === "appian-fc" && "border-b",
                )}
                onClick={() => toggleExperience("appian-fc")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md group">
                      <img
                        src="/logos/appian-logo.png"
                        alt="Appian Logo"
                        className="w-10 h-8 object-contain transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                    <div>
                      <CardTitle>Appian</CardTitle>
                      <CardDescription>Federal Consultant | September 2020 - May 2023</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        Low-code automation platform for business process management and workflow optimization
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 transition-transform", activeExperience === "appian-fc" && "rotate-180")}
                  />
                </div>
              </CardHeader>
              {activeExperience === "appian-fc" && (
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Redeveloped two entire sections of an application for Appian's biggest and longest standing consulting client with an ACV of $10M+ as part of a two-person development team</li>
                    <li>Revamped testing process as a personal side project for a DoD application that speeded up the loading of a test case by 10x, so users no longer needed to edit XML files</li>
                    <li>Recreated Yelp app in Appian's software by using Yelp API data and search functions and presented the app to the entire consulting department for a UX Showcase to display the power of Appian</li>
                    <li>Contribute on UX reviews bi-monthly for internal projects to improve the overall intuitiveness, usability, and design of Appian applications</li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </motion.div>

          <motion.div variants={item} className="mt-4">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader
                className={cn(
                  "cursor-pointer bg-gradient-to-r from-primary/10 to-primary/5",
                  activeExperience === "red-ventures" && "border-b",
                )}
                onClick={() => toggleExperience("red-ventures")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md group">
                      <img
                        src="/logos/red-ventures-logo.png"
                        alt="Red Ventures Logo"
                        className="w-8 h-8 object-contain transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                    <div>
                      <CardTitle>Red Ventures | Bankrate.com</CardTitle>
                      <CardDescription>Digital Ops Product Management Intern | June 2019 - August 2019</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        Digital marketing and financial services company focused on consumer decision-making
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 transition-transform", activeExperience === "red-ventures" && "rotate-180")}
                  />
                </div>
              </CardHeader>
              {activeExperience === "red-ventures" && (
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Developed in-depth analysis of an alternative partnership to evaluate the impact of shifting over 70% of traffic through Bankrate's personalized personal loans prequalification form experience</li>
                    <li>Built Looker dashboards and SQL queries used for reporting on entire marketing funnel performance to influence product strategy for Bankrate Loans' 600k+ monthly visitors and to gauge the effectiveness of A/B split traffic tests</li>
                    <li>Found discrepancy in data tables that was inaccurately inflating overall form submits by 13% and worked with the data and software engineering teams to develop a plan to fix it</li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </motion.section>

        <motion.section
          id="education"
          className="space-y-6 py-12 md:py-24"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-purple-600">Education & Skills</h2>
            <p className="text-muted-foreground">Academic background and technical expertise</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md group">
                      <img
                        src="/logos/uva-logo.png"
                        alt="University of Virginia Logo"
                        className="w-10 h-10 object-contain transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                    <CardTitle>Education</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">University of Virginia, School of Engineering</h3>
                    <p className="text-muted-foreground">Charlottesville, Virginia</p>
                    <p>B.S. in Systems and Information Engineering and B.A. Economics, Minor in Business</p>
                    <p>Graduated: May 2020 | GPA: 3.72 / 4.0</p>
                    <p className="font-medium mt-2">Honors: UVA Dean's List</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Relevant Coursework:</h4>
                    <p className="text-muted-foreground">
                      Data & Information Engineering, Statistics, Probability, Financial Accounting, Engineering Economic Systems, Software Development Methods, Intro to Programming, Human Factors
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Skills & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="skills">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="skills">Technical Skills</TabsTrigger>
                      <TabsTrigger value="certs">Certifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="skills" className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Badge>Appian</Badge>
                          <span className="text-xs text-muted-foreground">Advanced</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>SQL</Badge>
                          <span className="text-xs text-muted-foreground">Intermediate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>AWS Cloud</Badge>
                          <span className="text-xs text-muted-foreground">Intermediate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Python (Pandas)</Badge>
                          <span className="text-xs text-muted-foreground">Intermediate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>UiPath</Badge>
                          <span className="text-xs text-muted-foreground">Advanced</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>RPA</Badge>
                          <span className="text-xs text-muted-foreground">Advanced</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="certs" className="pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-primary" />
                          AI for Decision Making: Wharton Online
                        </li>
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-primary" />
                          AWS Cloud Practitioner
                        </li>
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-primary" />
                          Appian Senior Developer
                        </li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="space-y-6 py-12 md:py-24"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Leadership & Interests</h2>
            <p className="text-muted-foreground">Activities, service, and personal interests</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Leadership Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold">Virginia Club Lacrosse</h3>
                    <p className="text-muted-foreground">Charlottesville, Virginia</p>
                    <p>President, Executive Chairman of Events, National Champion | September 2017 – Present</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Managed all administrative and coaching responsibilities of the 60-man roster as the leader of the executive council</li>
                      <li>Won NCLL National Championship out of 135 teams as a starting defenseman</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold">Service</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Service trip to Peru</li>
                      <li>Capital Area Food Bank</li>
                      <li>Salvation Army</li>
                      <li>Habitat for Humanity</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Activities & Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold">Activities</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Appian First Year Experience Lead</li>
                        <li>Christian Retreat Leader</li>
                        <li>Malvern Prep Football Captain and MVP</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold">Interests</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Space Research & Technology</Badge>
                        <Badge variant="outline">Environmental Technology</Badge>
                        <Badge variant="outline">Artificial Intelligence</Badge>
                        <Badge variant="outline">Spikeball</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="connect"
          className="space-y-6 py-12 md:py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500/20 to-orange-400/10">
              <CardTitle className="text-center text-orange-600">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                <Button variant="outline" className="w-full md:w-auto gap-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  patfinley11@gmail.com
                </Button>
                <Button variant="outline" className="w-full md:w-auto gap-2 bg-transparent">
                  <Phone className="h-4 w-4" />
                  (484) 682-9054
                </Button>
                <Button variant="outline" className="w-full md:w-auto gap-2 bg-transparent">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button variant="outline" className="w-full md:w-auto gap-2 bg-transparent">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Patrick Finley. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
