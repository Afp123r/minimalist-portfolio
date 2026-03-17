'use client';

import { useEffect, useRef, useState } from 'react';
import content from '../config/content.json';
import emailjs from '@emailjs/browser';
import ViewCounter from "./ViewCounter";

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await emailjs.send(
        content.contact.emailjs.service_id,
        content.contact.emailjs.template_id,
        {
          from_name: formData.get('name'),
          from_email: formData.get('email'),
          message: formData.get('message'),
          to_email: content.contact.emailjs.to_email,
        },
        content.contact.emailjs.public_key
      );
      alert('Message sent successfully!');
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // 处理滚动事件
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
    };

    // 处理菜单点击
    const handleMenuClick = () => {
      const menu = document.querySelector('.menu');
      menu?.classList.toggle('active');
    };

    // 处理平滑滚动
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        const element = document.querySelector(href || '');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // 处理主题切换
    const handleThemeToggle = () => {
      const body = document.body;
      const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.classList.remove('dark-mode');
      if (newTheme === 'dark') {
        body.classList.add('dark-mode');
      }
      
      localStorage.setItem('theme', newTheme);
    };

    // 处理滚动进度
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const scrollProgress = document.getElementById('scrollProgress');
      if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
      }
    };

    // 处理技能条动画
    const animateSkillBars = () => {
      const skillBars = document.querySelectorAll('.skill-progress-bar');
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const skillBar = entry.target as HTMLElement;
            const skillLevel = skillBar.getAttribute('data-skill');
            if (skillLevel && !skillBar.classList.contains('animated')) {
              skillBar.style.width = skillLevel + '%';
              skillBar.classList.add('animated');
              
              // 动画百分比数字
              const percentage = skillBar.nextElementSibling as HTMLElement;
              if (percentage && percentage.classList.contains('skill-percentage')) {
                let current = 0;
                const target = parseInt(skillLevel);
                const increment = target / 50;
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= target) {
                    current = target;
                    clearInterval(timer);
                  }
                  percentage.textContent = Math.round(current) + '%';
                }, 30);
              }
            }
          }
        });
      }, { threshold: 0.5 });

      skillBars.forEach(bar => {
        skillObserver.observe(bar);
      });
    };

    // 初始化技能条
    setTimeout(() => {
      animateSkillBars();
    }, 100);

    // 磁性光标效果
    const initMagneticCursor = () => {
      const cursorDot = document.getElementById('cursorDot');
      const cursorTrail = document.getElementById('cursorTrail');
      
      if (!cursorDot || !cursorTrail) return;

      let mouseX = 0, mouseY = 0;
      let trailX = 0, trailY = 0;

      // 鼠标移动事件
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      };

      // 平滑移动轨迹
      const animateTrail = () => {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
      };

      // 磁性效果
      const handleMagneticHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
          if (element.contains(target)) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (mouseX - centerX) * 0.15;
            const deltaY = (mouseY - centerY) * 0.15;
            
            (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
          }
        });
      };

      const handleMagneticLeave = () => {
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        magneticElements.forEach(element => {
          (element as HTMLElement).style.transform = '';
        });
      };

      // 添加事件监听器
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', handleMagneticHover);
      window.addEventListener('mouseout', handleMagneticLeave);
      
      // 开始动画循环
      animateTrail();

      // 为交互元素添加磁性类
      const interactiveElements = document.querySelectorAll('button, a, .card, .frontSkill, .backSkill, .datasciSkill, .toolsSkill');
      interactiveElements.forEach(element => {
        element.classList.add('magnetic-hover');
      });

      // 隐藏默认光标
      document.body.style.cursor = 'none';
    };

    // 初始化磁性光标
    if (window.innerWidth > 768) { // 只在桌面端启用
      initMagneticCursor();
    }

    // 文字动画效果
    const initTextAnimations = () => {
      // 分割文字动画
      const splitTextElements = document.querySelectorAll('.split-text');
      splitTextElements.forEach(element => {
        const text = element.textContent || '';
        element.innerHTML = '';
        text.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.animationDelay = `${index * 0.05}s`;
          element.appendChild(span);
        });
      });

      // 渐变文字效果
      const headings = document.querySelectorAll('h1, h2, h3');
      headings.forEach((heading, index) => {
        if (index % 2 === 0) {
          heading.classList.add('gradient-text');
        }
      });

      // 滚动触发的文字动画
      const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-text');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('p, .text h2, .skillh1').forEach(element => {
        textObserver.observe(element);
      });
    };

    // 初始化文字动画
    initTextAnimations();

    // 返回顶部按钮
    const initBackToTop = () => {
      const backToTopButton = document.getElementById('backToTop');
      
      if (!backToTopButton) return;

      // 显示/隐藏按钮
      const toggleBackToTop = () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      };

      // 点击返回顶部
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      // 添加事件监听器
      window.addEventListener('scroll', toggleBackToTop);
      backToTopButton.addEventListener('click', scrollToTop);

      // 初始检查
      toggleBackToTop();
    };

    // 初始化返回顶部按钮
    initBackToTop();

    // 从localStorage加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }

    // 添加事件监听器
    window.addEventListener('scroll', () => {
      handleScroll();
      updateScrollProgress();
    });
    document.querySelector('.menu-toggle')?.addEventListener('click', handleMenuClick);
    document.querySelector('.menu')?.addEventListener('click', handleSmoothScroll);
    document.getElementById('themeToggle')?.addEventListener('click', handleThemeToggle);

    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.querySelector('.menu-toggle')?.removeEventListener('click', handleMenuClick);
      document.querySelector('.menu')?.removeEventListener('click', handleSmoothScroll);
      document.getElementById('themeToggle')?.removeEventListener('click', handleThemeToggle);
    };
  }, []);

  return (
    <>
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Leckerli+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Leckerli+One&family=Lilita+One&family=Patrick+Hand&family=Shadows+Into+Light&display=swap" rel="stylesheet" />
      <link href="/style.css" rel="stylesheet" />

      {/* Scroll Progress Indicator */}
      <div className="scroll-progress" id="scrollProgress"></div>

      {/* Custom Cursor */}
      <div className="cursor-dot" id="cursorDot"></div>
      <div className="cursor-trail" id="cursorTrail"></div>

      {/* Back to Top Button */}
      <button className="back-to-top" id="backToTop" aria-label="Back to top">
        <span className="back-to-top-icon">↑</span>
      </button>

      <header>
        <nav id="navBar" className="navBar">
          <div className="name" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <h1>{content.nav.name}</h1>
          </div>
          <div className="menu-toggle" id="menuToggle">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <div className="menu" id="menu">
            <ul>
              {content.nav.menu.map((item, index) => (
                <li key={index}><a href={item.link}>{item.text}</a></li>
              ))}
              <li>
                <button className="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                  <span className="sun-icon">☀️</span>
                  <span className="moon-icon">🌙</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="over"></div>
        <div className="hero-container">
          <h1>
            <p className="up">{content.hero.greeting}</p><br />
            {/* <p className="down">{content.hero.name}</p> */}
          </h1>
          <h1>I'm <span className="auto-type">{content.hero.name}</span></h1>
          <div className="botton">
            {content.contact.social.map((social, index) => (
              <a key={index} href={social.link} target="_blank">
                <img src={`/images/${social.icon}.svg`} alt={social.name} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-container">
          <div className="imgeffect">
            <div className="flipper">
              <div className="front">
                <img src="/images/githubprofile.png" alt="" />
              </div>
              <div className="back">
                <img src="/images/profile2.png" alt="" />
              </div>
            </div>
          </div>
          <div className="text">
            <p className="p1">Who Am I?</p>
            <h2>{content.about.title}</h2>
            {content.about.description.map((para, index) => (
              <p key={index} className="p2">{para}</p>
            ))}
            <a href={content.hero.resume} target="_blank"><button>{content.about.button}</button></a>
          </div>
        </div>
      </section>

      <section className="Skills" id="skills">
        <div className="container">
          <div className="heading">
            <h1 className="skillh1">{content.skills.title}</h1>
          </div>
          <div className="mainSkill">
            <div className="front">
              <h2>Frontend</h2>
              <div className="box">
                {content.skills.categories[0].skills.map((skill, index) => (
                  <div key={index} className="frontSkill">
                    <img src={skill.image} alt="" />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="back">
              <h2>Backend</h2>
              <div className="box">
                {content.skills.categories[1].skills.map((skill, index) => (
                  <div key={index} className="backSkill">
                    <img src={skill.image} alt="" />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="datasci">
              <h2>Data Science</h2>
              <div className="box">
                {content.skills.categories[2].skills.map((skill, index) => (
                  <div key={index} className="datasciSkill">
                    <img src={skill.image} alt="" />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="tools">
              <h2>Tools</h2>
              <div className="box">
                {content.skills.categories[3].skills.map((skill, index) => (
                  <div key={index} className="toolsSkill">
                    <img src={skill.image} alt="" />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="expirience" id="experience">
        <h1 className="skillh1">{content.experience.title}</h1>
        <div className="container-ex">
          {content.experience.timeline.map((item, index) => (
            <div key={index} className={`timeline-block timeline-block-${index % 2 === 0 ? 'right' : 'left'}`}>
              <div className="marker"></div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <span>{item.company} | {item.period}</span>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="project" id="projects">
        <div className="main">
          <h1>{content.projects.title}</h1>
        </div>
        <div className="container">
          {content.projects.items.map((project, index) => (
            <div key={index} className="card">
              <div className="card-inner" style={{ '--clr': '#fff' } as React.CSSProperties}>
                <div className="box">
                  <div className="imgBox">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="icon">
                    <a href={project.site} className="iconBox" target="_blank" rel="noopener noreferrer">
                      <img src="/images/arrow.svg" alt="arrow" className="arrow-icon" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <li className="github">github</li>
                  </a>
                  <a href={project.site} target="_blank" rel="noopener noreferrer">
                    <li className="site">visit site</li>
                  </a>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="main">
          <h1>{content.contact.title}</h1>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <h2>Name</h2>
            <p><strong>NEOH WEI JIAN</strong></p>
            <h2>Email</h2>
            <p><a href="mailto:henryneoh22@gmail.com" style={{ color: '#fff', fontWeight: 'bold' }}><strong>henryneoh22@gmail.com</strong></a></p>
            <h2>Phone</h2>
            <p><a href="tel:+60173014638" style={{ color: '#fff', fontWeight: 'bold' }}><strong>0173014638</strong></a></p>
            <div className="social-links">
              {content.contact.social.map((social, index) => (
                <a key={index} href={social.link} target="_blank">
                  <img src={`/images/${social.icon}.svg`} alt={social.name} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ViewCounter />
    </>
  );
}
