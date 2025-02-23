

export const formatDateTime = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString();
    const formattedTime = newDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  
    return (
      <>
        {formattedDate} <br /> {formattedTime}
      </>
    );
  };