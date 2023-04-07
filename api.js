const API = (() => {
    const URL = "http://localhost:3000/courseList";
    
    //async function, should return a promise
    const getCourse = async () => {
      const res = await fetch(URL)
      return await res.json()
    };
  
  
    return {
      getCourse
    };
  })();

// API.getCourse().then(data => console.log(data))
