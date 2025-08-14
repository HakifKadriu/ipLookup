"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import { AppDispatch } from "../state/store";
import { useDispatch } from "react-redux";
import { addRecentIp } from "../state/ip/ipSlice";

export default function Navbar() {
  const location = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    initializeLocalStorage();
  }, []);

  function initializeLocalStorage() {
    // Check if recentIps exists in localStorage, if not, initialize it
    if (localStorage.getItem("recentIps") === null) {
      localStorage.setItem("recentIps", JSON.stringify([]));
    }

    const recentIps = localStorage.getItem("recentIps");
    if (recentIps) {
      const ips = JSON.parse(recentIps);
      ips.forEach((ip: any) => {
        dispatch(addRecentIp(ip));
      });
    }

  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        fontFamily: "lato",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <div style={{ flex: 1 }}></div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
          IP Lookup
        </Link>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: "2rem",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#fff",
            borderBottom: location === "/" ? "2px solid #fff" : "none",
          }}
        >
          HOME
        </Link>
        <Link
          href="/about"
          style={{
            textDecoration: "none",
            color: "#fff",
            borderBottom: location === "/about" ? "2px solid #fff" : "none",
          }}
        >
          CONTACT US
        </Link>
      </div>
    </nav>
  );
}
