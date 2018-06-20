## USAGE
define the variable maximum screen in file scroll.js <br />
add the template html in the index.html <br />
html have to be place in order or you have to use z-index yourself



### variable
1. var screen_total: define total of screen.
2. var speed_coeff: accelerate or slow down the rounded animation.

#### position available :
* 'top-right'
* 'top-left'
* 'bottom-left'
* 'bottom-right'
 
#### Square template

&lt;div class="square" data-start="2"&gt;  <br />
&lt;img src="" alt=""&gt;   <br />
&lt;/div&gt; <br />

#### Round template

&lt;div class="rounded" data-start="X" data-position="top-left"&gt; <br />
&lt;img src="img_vet_full/1.jpg" alt=""&gt; <br />
&lt;/div&gt;


##### Duration
Square: 
1. appear: 1 screen 
2. visible: 1 screen 
3. disappear: 1 screen (total 3screen)

Round:
1. appear: 1 screen
2. visible: infinite
3. disappear: never but it is recover by other

