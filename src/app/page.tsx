"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { getIpInformation, addRecentIp, IpData } from "./state/ip/ipSlice";
import InformationCard from "./components/informationCard";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.ip.data);
  const loading = useSelector((state: RootState) => state.ip.loading);
  const error = useSelector((state: RootState) => state.ip.error);
  const recentIps = useSelector((state: RootState) => state.ip.recentIps);

  const [ip, setIp] = useState("");
  const [isConn, setIsConn] = useState(true);

  // Converts a Haxball connection key (hex) to an IPv4 string.
  function connKeyToIP(connKey: string): string {
    if (!connKey) throw new Error("Empty connection key");

    // keep only hex chars (handles spaces, 0x prefix, etc.)
    const hex = connKey.replace(/[^0-9a-f]/gi, "");
    if (hex.length % 2 !== 0) {
      throw new Error("Invalid hex: odd length");
    }

    // Decode hex -> ASCII string
    let ascii = "";
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.slice(i, i + 2), 16);
      if (Number.isNaN(byte)) throw new Error("Invalid hex byte");
      ascii += String.fromCharCode(byte);
    }

    // If it's already a dotted IPv4 in ASCII (e.g. "46.217.91.3"), validate and return
    const dottedIPv4 = /^\d{1,3}(\.\d{1,3}){3}$/;
    if (dottedIPv4.test(ascii)) {
      const parts = ascii.split(".").map((n) => Number(n));
      if (parts.every((n) => n >= 0 && n <= 255)) {
        return parts.join(".");
      }
    }

    // if the hex is 4 bytes (8 hex chars), treat as raw IPv4 bytes
    if (hex.length === 8) {
      const octets = [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        parseInt(hex.slice(6, 8), 16),
      ];
      if (octets.every((n) => n >= 0 && n <= 255)) {
        return octets.join(".");
      }
    }

    throw new Error("Connection key is not a valid Haxball IPv4 encoding");
  }

  const handleSubmit = async () => {
    let result;

    if (isConn) {
      result = await dispatch(getIpInformation(connKeyToIP(ip)));
    } else {
      result = await dispatch(getIpInformation(ip));
    }

    // const result = await dispatch(getIpInformation(connKeyToIP(ip)));

    if (getIpInformation.fulfilled.match(result)) {
      const data = result.payload;
      dispatch(addRecentIp(data));
      localStorage.setItem("recentIps", JSON.stringify([...recentIps, data]));
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "lato",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          width: "80%",
          padding: "1rem",
        }}
      >
        <div className="flex text-center justify-between w-full my-4 border rounded-2xl text-[1.4rem] font-bold py-2">
          <div
            className={`w-full cursor-pointer border-r-2 select-none transition duration-1000   ${
              isConn ? "underline" : "bg-transparent"
            }`}
            onClick={() => setIsConn(true)}
          >
            Connection Key
          </div>
          <div
            className={`w-full cursor-pointer select-none transition duration-1000   ${
              isConn ? "bg-transparent" : "underline"
            }`}
            onClick={() => setIsConn(false)}
          >
            Ip Address
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="border border-gray-300 rounded-md p-2 flex items-center"
        >
          <input
            type="text"
            name="ip"
            placeholder="Enter IP address"
            className="focus:outline-none w-full"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <X className="cursor-pointer" onClick={() => setIp("")} />
        </form>
        {loading && <p>Loading...</p>}
        {error && (
          <div className="border mt-6 border-gray-300 rounded-2xl p-4 min-w-[300px] text-lg font-lato shadow-2xl hover:scale-102 transition-transform">
            <div className="font-bold">IP Address Information</div>
            <div className="text-sm mb-5 opacity-80">
              Location details for the IP address
            </div>
            <div className="flex justify-between text-red-500">
              <div>{error}</div>
            </div>
          </div>
        )}

        <div className={data ? "visible mt-6" : "hidden"}>
          {data && <InformationCard data={data} />}
        </div>
        <h2 className="text-xl font-bold flex mt-24 justify-center">
          Recent IPs
        </h2>
        <div className="flex flex-wrap justify-center gap-4 p-4 ">
          {recentIps
            .map((recentIp: IpData, index: number) => (
              <InformationCard key={index} data={recentIp} />
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
}
