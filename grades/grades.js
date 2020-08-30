

function openTab(evt, term) {
    // Declare all variables

    // Get all elements with class="tabcontent" and hide them
    let contents = document.getElementsByClassName("content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    let tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(term).style.display = "block";
    evt.currentTarget.className += " active";
}

function fill(name, content) {
    let elems = document.getElementsByClassName(name);
    for (i = 0; i < elems.length; i++) {
        elems[i].innerText = content;
    }
}

function fillGrades() {
    fill('succ', '+');
    fill('fail', '-');
    fill('five', '5');
    fill('four', '4');
    fill('three', '3');
    fill('two', '2');
}

function fillGPA() {
    fives = document.getElementsByClassName("five").length;
    fours = document.getElementsByClassName("four").length;
    threes = document.getElementsByClassName("three").length;
    twos = document.getElementsByClassName("two").length;

    GPA = (fives * 5 + + fours * 4 + threes * 3 + twos * 2) / (fives + fours + threes + twos);
    document.getElementById("gpa5").innerText = GPA.toFixed(2);
    document.getElementById("gpa4").innerText = (GPA * 4 / 5).toFixed(2);
}