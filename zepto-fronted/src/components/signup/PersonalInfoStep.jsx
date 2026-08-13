import React from "react";

const PersonalInfoStep = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-4 w-full max-w-md">
      <input
        placeholder="Full Name"
        value={data.userName}
        onChange={(e) => onChange({ ...data, userName: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) => onChange({ ...data, email: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        placeholder="Phone Number"
        value={data.phoneNumber}
        onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => onChange({ ...data, password: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default PersonalInfoStep;
