"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

const About = () => {
  const data = useSelector((state: RootState) => state.ip.data);
  const recentIps = useSelector((state: RootState) => state.ip.recentIps);

  return (
    <div>
      <h1>Hi</h1>
      {/* <h1 className="bg-white p-4 text-black">Ip is: {data}</h1> */}
    </div>
  );
};

export default About;
