"use client"

import useCurrentDate from "@/hooks/useCurrentDate";

const LastUpdate = () => {
  const currentDate = useCurrentDate();
  return (
    <>
      Last updated <span>{currentDate}</span>
    </>
  )
}
export default LastUpdate