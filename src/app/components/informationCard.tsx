import React from "react";

interface InformationCardProps {
  data: {
    ip: string;
    city: string;
    region: string;
    country: string;
    countryCode: string;
  };
}

const IPAddressField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <div>{label}:</div>
    <div>{value}</div>
  </div>
);

const InformationCard = (props: InformationCardProps) => {
  const { data } = props;

  return (
    <div className="border border-gray-300 rounded-2xl p-4 min-w-[300px] text-lg font-lato shadow-2xl hover:scale-102 transition-transform">
      <div className="font-bold">IP Address Information</div>
      <div className="text-sm mb-5 opacity-80">
        Location details for the IP address
      </div>
      {data.ip ? (
        <>
          <IPAddressField label="Ip Address" value={data.ip} />
          <IPAddressField label="City" value={data.city} />
          <IPAddressField label="Region" value={data.region} />
          <IPAddressField label="Country" value={data.country} />
          <IPAddressField label="Country Code" value={data.countryCode} />
        </>
      ) : (
        <div className="flex justify-between text-red-500">
          <div>Invalid IP address.</div>
        </div>
      )}
    </div>
  );
};

export default InformationCard;
