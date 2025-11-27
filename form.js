document.getElementById("teamForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("firstname").value;
    const community = document.getElementById("community").value;
    const facebook = document.getElementById("facebook").value;
    const instagram = document.getElementById("instagram").value;
    const linkedin = document.getElementById("linkedin").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const github = document.getElementById("github").value;
    const imageFile = document.getElementById("image").files[0];
    const memberData = {
        name: name,
        title: "",
        department: community,
        role: "member",
        image: "", 
        social: {
            facebook,
            instagram,
            linkedin,
            whatsapp,
            github
        }
    };
    document.getElementById("teamForm").style.display = "none";
    document.getElementById("thankYouCard").style.display = "block";
});