"use client";

import { useState, useEffect } from "react";

export default function NextBatchDate({ serverDate }) {
  const [dateStr, setDateStr] = useState(serverDate);

  useEffect(() => {
    const getNextMondayDateStr = () => {
      const today = new Date();
      const day = today.getDay();
      let daysToNextMonday = 1 - day;
      if (daysToNextMonday <= 0) {
        daysToNextMonday += 7;
      }
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysToNextMonday);

      const dd = String(nextMonday.getDate()).padStart(2, "0");
      const mm = String(nextMonday.getMonth() + 1).padStart(2, "0");
      const yy = String(nextMonday.getFullYear()).slice(-2);

      return `${dd}/${mm}/${yy}`;
    };

    setDateStr(getNextMondayDateStr());
  }, []);

  return <>{dateStr}</>;
}
