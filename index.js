class View {
    constructor() {
      this.available = document.querySelector(".avaiable-list");
      this.selected = document.querySelector(".selected-list");
    //   this.courseItem = document.querySelectorAll(".course-item");
    //   this.addBtn = document.querySelector("todo__actions--add");
    //   this.todoList = document.querySelector(".todolist");
    }

    renderCourses(courses,init=true) {
        courses.forEach((course) => {
            (init? this.available:this.selected).innerHTML += `
              <div class="course-item" id="${course.courseId}">
                ${course.courseName}<br>
                Course Type: ${course.required?`Compulsory`:`Elective`}<br>
                Course Credit: ${course.credit}
              </div>
              `
            // this.available.innerHTML += `
            //   <div class="course-item" id="${course.courseId}">
            //     <div class="course-name">${course.courseName}</div>
            //     <div class="course-type">
            //         Course Type: ${course.required?`Compulsory`:`Elective`}
            //     </div>
            //     <div class="course-credit">
            //         Course Credit: ${course.credit}
            //     </div>
            //   </div>
            //   `;
          });
    }

    toggleSelect(id) {
        const selected = document.getElementById(id);
        if (selected.style.backgroundColor === "deepskyblue") {
            selected.style.backgroundColor = (id%2===0?"white":"rgb(221, 239, 221)");
        }else{
            selected.style.backgroundColor = "deepskyblue";
        }
    }

    disableSelect() {
        const btn = document.querySelector("#select-btn");
        btn.disabled = true;
    }

    
}

class Model {
    #courses;
    constructor() {
        this.#courses = [];
        this.selected = [];
    }

    async fetchCourses() {
        const courses = await API.getCourse();  
        this.#courses = courses; 
        return courses; 
    }

}

class CourseConroller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.selectedList = [];
    //   this.courseList = [];
      this.credit = 0;
      this.init();
    }

    init() {
        this.model.fetchCourses().then((data) => {
            const courses = data; //an arrray
            this.view.renderCourses(courses);
        });
        // this.creditCalc();
        this.setSelect();
        this.submitSelect();
        
    }

    setSelect() {
        // console.log(this.view.courseItem);
        this.view.available.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.credit > 18){
                alert("You can only choose up to 18 credits in one semester");
                return;
            }
            this.view.toggleSelect(e.target.id);
            if (this.selectedList.includes(e.target.id)) {
                this.selectedList.splice(this.selectedList.indexOf(e.target.id), 1)
            }else{
                this.selectedList.push(e.target.id);
            }
            const c = this.creditCalc(this.selectedList);
            console.log(c);
        })
    }

    submitSelect() {
        const submitBtn = document.querySelector("#select-btn");
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.model.fetchCourses().then((data) => {
                const courses = JSON.parse(JSON.stringify(data))
                const selectedCourses = courses.filter((course) => (
                    this.selectedList.includes(String(course.courseId))
                ))
                if (confirm(`You have chosen ${this.credit} credits for this semester. You cannot change once you submit. Do you want to confirm?`)){
                    this.view.renderCourses(selectedCourses,false);
                    this.view.disableSelect();
                }
                
            });
            
        })
    }

    creditCalc(list){
        
        const credit = document.querySelector("#total-credit");
        this.model.fetchCourses().then((data) => {
            
            const courses = JSON.parse(JSON.stringify(data))
            const selectedCourses = courses.filter((course) => {
                // console.log(list)
                return list.includes(String(course.courseId))
            })
            // console.log(selectedCourses);
            let totalCredit = 0;
            selectedCourses.forEach((course) => {
                totalCredit += course.credit;
            })
            this.credit = totalCredit;
            // console.log(this.credit);
            credit.innerHTML = `${totalCredit}`;
            return totalCredit;
        })
            
        
        // this.view.available.addEventListener("click", (e) => {
        //     e.preventDefault();
        //     this.model.fetchCourses().then((data) => {
        //         const courses = JSON.parse(JSON.stringify(data))
        //         const selectedCourses = courses.filter((course) => (
        //             this.selectedList.includes(String(course.courseId))
        //         ))
        //         let totalCredit = 0;
        //         selectedCourses.forEach((course) => {
        //             totalCredit += course.credit;
        //         })
        //         this.credit = totalCredit;
        //         credit.innerHTML = `${totalCredit}`;
        //     })
            
        // });
        
        
    }
       
    

}
const app = new CourseConroller(new Model(), new View());