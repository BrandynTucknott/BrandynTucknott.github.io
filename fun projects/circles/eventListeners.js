circles.style.position = 'absolute';
circles.style.left = `${display_screen.getBoundingClientRect().left}`;
circles.style.top = `${display_screen.getBoundingClientRect().top}`;

add_button.addEventListener('click', () =>
{
    let circle = createCircle(); // html tag for the button

    circles.appendChild(circle);
    
    editCircles();
});

remove_button.addEventListener('click', ()=>
{
    removeCircle();
    editCircles();
})

clear_button.addEventListener('click', () =>
{
    removeAllCircles();
});

start_button.addEventListener('click', () =>
{
    if (running)
        return;
    console.log('started');
    interval = setInterval(moveCircles, 1000, angular_velocity / 1);
    running = true;
});

stop_button.addEventListener('click', () =>
{
    console.log('stopped');
    clearInterval(interval);
    running = false;
    rotation_count = 1;
});