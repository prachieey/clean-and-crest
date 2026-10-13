"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, ArrowRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config";
import { Button, Icon } from "@/components/ui";
import styles from "./header.module.css";

const navItems = siteConfig.navigation;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle Escape key, focus trapping, and restoration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        const panel = mobilePanelRef.current;
        if (!panel) return;
        const focusableElements = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === menuButtonRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Move focus into the menu panel
      setTimeout(() => {
        firstNavLinkRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
    menuButtonRef.current?.focus();
  };

  const phoneLink = siteConfig.business.phoneHref || `tel:${siteConfig.business.phone}`;

  return (
    <>
      {/* Skip to Main Content Link */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`.trim()}
      >
        <div className={styles.headerInner}>
          {/* Logo / Brand */}
          <Link href="/" className={styles.brandLink} onClick={() => setIsOpen(false)}>
            <Image
              src="/images/clean-and-crest-logo.jpg"
              alt=""
              width={44}
              height={44}
              className={styles.brandLogo}
              priority
            />
            <span className={styles.brandText}>{siteConfig.business.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation">
            <ul className={styles.navDesktop}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`.trim()}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop Action CTAs */}
          <div className={styles.actionsDesktop}>
            <Button
              variant="secondary"
              href={phoneLink}
              className={styles.actionCall}
            >
              <Icon icon={Phone} size={18} />
              <span>Call Now</span>
            </Button>

            <Button
              variant="primary"
              href="/quote"
              className={styles.actionQuote}
            >
              <span>Get a Free Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-panel"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <Icon icon={isOpen ? X : Menu} size={24} />
          </button>
        </div>

        {/* Mobile Full-Width Drawer Panel */}
        <div
          ref={mobilePanelRef}
          id="mobile-navigation-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`${styles.mobilePanel} ${isOpen ? styles.mobilePanelOpen : ""}`.trim()}
          aria-hidden={!isOpen}
        >
          <nav aria-label="Mobile Navigation">
            <ul className={styles.mobileNavList}>
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      ref={index === 0 ? firstNavLinkRef : undefined}
                      href={item.href}
                      className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`.trim()}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.label}</span>
                      <Icon icon={ArrowRight} size={18} color="var(--color-ink-500)" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Pinned Mobile CTAs */}
          <div className={styles.mobileActions}>
            <Button
              variant="primary"
              href="/quote"
              className={styles.mobileActionBtn}
              onClick={closeMenu}
            >
              <span>Get a Free Quote</span>
              <Icon icon={ArrowRight} size={18} />
            </Button>

            <Button
              variant="secondary"
              href={phoneLink}
              className={styles.mobileActionBtn}
              onClick={closeMenu}
            >
              <Icon icon={Phone} size={18} />
              <span>Call Now</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
