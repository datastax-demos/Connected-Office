//Home Tab
$('#mainTabs a[href="#home"]').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})

//Environment Tab
$('#environment a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
})

//Tracker Tab
$('#tracker a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})

//Snacks Tab
$('#snacks a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})

//Global Tab
$('#global a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
    drawMap();
})
