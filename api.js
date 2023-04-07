const API = (() => {
    const URL = "http://localhost:3000/courseList";
    
    const getCourse = async () => {
      const res = await fetch(URL)
      return await res.json()
    };
  
  
    return {
      getCourse
    };
  })();


