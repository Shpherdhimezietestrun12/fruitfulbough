  // for the index page 
  const AdsCont = document.querySelector('.presentation-2');
  const ExitAds1 = document.querySelector('.pres-2');


  ExitAds1.addEventListener('click', () => {
      AdsCont.style.display = 'none';
  });



  // For sample testing...

  const ButOne = document.querySelector('.but-test-one');
  const ExitDiv = document.querySelector('.div-test-two');
  const ShowDiv = document.querySelector('.div-test-three');

  // All an event listener to the button
  ButOne.addEventListener('click', function() {
      // Not show
      ExitDiv.replaceWith(ShowDiv);
      // Show  the div to show
      ShowDiv.style.display = 'block';
  });



  const But120 = document.querySelector('.but_120');
  const DivTestOne = document.querySelector('.div-test-one');

  // for Exploring 
  But120.addEventListener('click', function() {
      DivTestOne.style.display = 'none';
  });




  const Load2Img = document.querySelector('.but_4100_1');
  const Load2Div = document.querySelector('.div-load2-show');

  Load2Img.addEventListener('mouseenter', () => {
      Load2Div.style.opacity = '1';
      Load2Div.style.visibility = 'visible';
  });


  Load2Img.addEventListener('mouseleave', () => {
      Load2Div.style.opacity = '0';
      Load2Div.style.visibility = 'hidden';
  });



  document.addEventListener('DOMContentLoaded', () => {
      const RemCoo = document.querySelector('.but-one-2');
      const DivCoo = document.querySelector('.cookies-div');
      const BntCoo = document.querySelector('.but-one-1');


      // Using local storage to keep response of the user prefrence.. this should be corrected after to ensure users experience...
      if (!localStorage.getItem('cookieNoticeDismissed')) {
          DivCoo.style.display = 'block';
      }
      RemCoo.addEventListener('click', () => {
          DivCoo.style.display = 'none';
          localStorage.setItem('cookieNoticeDismissed', true);
      });
      BntCoo.addEventListener('click', () => {
          DivCoo.style.display = 'none';
          localStorage.setItem('cookieNoticeDismissed', true);
      });
  });



  const CynthiaImg = document.querySelector('.Cynthia-load');
  const CynthiaDiv = document.querySelector('.cynthia-name-show');
  const CynthiaDisplay = document.querySelector('.Cynthia-display');

  CynthiaImg.addEventListener('click', () => {
      CynthiaDisplay.style.display = 'block';
  });

  CynthiaImg.addEventListener('mouseenter', () => {
      CynthiaDiv.style.opacity = '1';
      CynthiaDiv.style.visibility = 'visible';
  });

  CynthiaImg.addEventListener('mouseleave', () => {
      CynthiaDiv.style.opacity = '0';
      CynthiaDiv.style.visibility = 'hidden';
  });




  const MainContainer = document.querySelector('.cynthia-content-div');
  const TriggerCont = document.querySelector('.Cynthia-load');

  TriggerCont.addEventListener('click', () => {
      if (window.getComputedStyle(MainContainer).display === 'none') {
          console.warn('.cynthia-content-div is hidden, will not type.');
          return;
      }
      createTypeContainer(1, () => createTypeContainer(2));
  });

  function createTypeContainer(num, callback) {
      let div10002 = MainContainer.querySelector(`.contain-${num}`);
      if (!div10002) {
          div10002 = document.createElement('div');
          div10002.className = `contain-${num}`; // CSS handles position:absolute
          // Position logic
          const prev = MainContainer.querySelector(`.contain-${num - 1}`);
          if (prev) {
              const prevRect = prev.getBoundingClientRect();
              div10002.style.top = `${prevRect.bottom - MainContainer.getBoundingClientRect().top + 5}px`;
          } else {
              div10002.style.top = '90px';
          }
          MainContainer.appendChild(div10002);
      }

      let ii = 0;
      div10002.textContent = '';
      const ToogleWords = num == 1 ? WordsOne : WordsTwo; // pick text based on num

      function typeTwo() {
          if (ii < ToogleWords.length) {
              div10002.textContent += ToogleWords.charAt(ii);
              ii++;
              setTimeout(typeTwo, 100);
          } else if (callback) {
              callback(); // Trigger next container after finish
          }
      }

      typeTwo();
  }



  const spanTest = document.querySelector('.sp-test-par');
  const MainDiv1 = document.querySelector('.Cynthia-display');
  const spanExit = document.querySelector('.cynthia-img-exit');
  const textWritten = ". . . . . . . . .";
  let This = 0; // counter

  function type() {
      if (This < textWritten.length) {
          spanTest.textContent += textWritten.charAt(This); // ✅ add to span, not string
          This++;
          setTimeout(type, 250);
      } else {
          setTimeout(() => {
              spanTest.textContent = '';
              This = 0;
              type();
          }, 1500);
      }
  }

  type(); // start typing





  // if the span button is clicked
  spanExit.addEventListener('click', () => {
      MainDiv1.style.display = 'none';
  });
  const HeaderCont = document.querySelector('.div_2000');
  const ScrollCont = document.querySelector('.div_5100');
  const ScrollCont2 = document.querySelector('.div_favourite');
  const ScrollCont3 = document.querySelector('.div_profile');
  const ScrollCont4 = document.querySelector('.div_notify');
  const ScrollCont5 = document.querySelector('.div_dashboard');
  const ScrollCont6 = document.querySelector('.div_policy');
  const ScrollCont7 = document.querySelector('.div_about');


  ScrollCont.addEventListener('scroll', () => {
      if (ScrollCont.scrollTop > 50) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });
  ScrollCont2.addEventListener('scroll', () => {
      if (ScrollCont2.scrollTop > 10) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });
  ScrollCont3.addEventListener('scroll', () => {
      if (ScrollCont3.scrollTop > 10) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });
  ScrollCont4.addEventListener('scroll', () => {
      if (ScrollCont4.scrollTop > 10) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });
  ScrollCont5.addEventListener('scroll', () => {
      if (ScrollCont5.scrollTop > 10) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });
  ScrollCont6.addEventListener('scroll', () => {
      if (ScrollCont6.scrollTop > 10) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });
  ScrollCont7.addEventListener('scroll', () => {
      if (ScrollCont7.scrollTop > 10) { // Change the scroll threshold when  applied
          HeaderCont.style.backgroundColor = '#111111';
      } else {
          HeaderCont.style.backgroundColor = 'transparent';
      }
  });

  const Menu_Cont = document.querySelector('.img_2000');
  const Rem_1Cont = document.querySelector('.div-test-test');



  Menu_Cont.addEventListener('click', () => {
      // Toggle between both ways...
      ScrollCont.classList.toggle('expanded');
      ScrollCont2.classList.toggle('expanded');
      ScrollCont3.classList.toggle('expanded');
      ScrollCont4.classList.toggle('expanded');
      ScrollCont5.classList.toggle('expanded');
      ScrollCont6.classList.toggle('expanded');
      ScrollCont7.classList.toggle('expanded');
      // Toggle visibility of .div-test-test
      Rem_1Cont.classList.toggle('hidden'); // Fix: applied to the correct element
  });


  const HisImg = document.querySelector('.bnt_1200');
  const HisDiv = document.querySelector('.div-his-show');

  HisImg.addEventListener('mouseenter', () => {
      HisDiv.style.opacity = '1';
      HisDiv.style.visibility = 'visible';
  });

  HisImg.addEventListener('mouseleave', () => {
      HisDiv.style.opacity = '0';
      HisDiv.style.visibility = 'hidden';
  });



  const LoadImg = document.querySelector('.bnt_1000');
  const LoadDiv = document.querySelector('.div-load-show');

  LoadImg.addEventListener('mouseenter', () => {
      LoadDiv.style.opacity = '1';
      LoadDiv.style.visibility = 'visible';
  });


  LoadImg.addEventListener('mouseleave', () => {
      LoadDiv.style.opacity = '0';
      LoadDiv.style.visibility = 'hidden';
  });



  const NameImg = document.querySelector('.par_1000');
  const NameDiv = document.querySelector('.div-name-show');

  NameImg.addEventListener('mouseenter', () => {
      NameDiv.style.opacity = '1';
      NameDiv.style.visibility = 'visible';
  });

  NameImg.addEventListener('mouseleave', () => {
      NameDiv.style.opacity = '0';
      NameDiv.style.visibility = 'hidden';
  });


  const LogoImg = document.querySelector('.img_2100');
  const LogoDiv = document.querySelector('.div-logo-show');

  LogoImg.addEventListener('mouseenter', () => {
      LogoDiv.style.opacity = '1';
      LogoDiv.style.visibility = 'visible';
  });

  LogoImg.addEventListener('mouseleave', () => {
      LogoDiv.style.opacity = '0';
      LogoDiv.style.visibility = 'hidden';
  });

  const MenuImg = document.querySelector('.img_2000');
  const MenuDiv = document.querySelector('.div-menu-show');

  MenuImg.addEventListener('mouseenter', () => {
      MenuDiv.style.opacity = '1';
      MenuDiv.style.visibility = 'visible';
  });

  MenuImg.addEventListener('mouseleave', () => {
      MenuDiv.style.opacity = '0';
      MenuDiv.style.visibility = 'hidden';
  });



  // Select between each div's for presenting 
  const buttons = document.querySelectorAll('.nav-btn');
  const contents = document.querySelectorAll('.content-div');


  // Map button index to content class
  const contentClasses = [
      'div_5100', // bnt_div_3100-1
      'div_favourite', // bnt_div_3100-2
      'div_profile', // bnt_div_3100-3
      'div_notify', // bnt_div_3100-4
      'div_dashboard', // bnt_div_3100-5
      'div_policy', // bnt_div_3100-6
      'div_about' // bnt_div_3100-7
  ];

  buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
          // Toggle active class on buttons
          buttons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          // Show/hide content
          const targetClass = contentClasses[index];
          contents.forEach(content => {
              if (content.classList.contains(targetClass)) {
                  content.classList.add('active');
              } else {
                  content.classList.remove('active');
              }
          });
      });
  });



  const AboImg = document.querySelector('.bnt_div_3100-7');
  const AboDiv = document.querySelector('.div-abo-show');

  AboImg.addEventListener('mouseenter', () => {
      AboDiv.style.opacity = '1';
      AboDiv.style.visibility = 'visible';
  });


  AboImg.addEventListener('mouseleave', () => {
      AboDiv.style.opacity = '0';
      AboDiv.style.visibility = 'hidden';
  });



  const PolImg = document.querySelector('.bnt_div_3100-6');
  const PolDiv = document.querySelector('.div-pol-show');

  PolImg.addEventListener('mouseenter', () => {
      PolDiv.style.opacity = '1';
      PolDiv.style.visibility = 'visible';
  });


  PolImg.addEventListener('mouseleave', () => {
      PolDiv.style.opacity = '0';
      PolDiv.style.visibility = 'hidden';
  });


  const DasImg = document.querySelector('.bnt_div_3100-5');
  const DasDiv = document.querySelector('.div-das-show');

  DasImg.addEventListener('mouseenter', () => {
      DasDiv.style.opacity = '1';
      DasDiv.style.visibility = 'visible';
  });


  DasImg.addEventListener('mouseleave', () => {
      DasDiv.style.opacity = '0';
      DasDiv.style.visibility = 'hidden';
  });


  const NoteImg = document.querySelector('.bnt_div_3100-4');
  const NoteDiv = document.querySelector('.div-note-show');

  NoteImg.addEventListener('mouseenter', () => {
      NoteDiv.style.opacity = '1';
      NoteDiv.style.visibility = 'visible';
  });


  NoteImg.addEventListener('mouseleave', () => {
      NoteDiv.style.opacity = '0';
      NoteDiv.style.visibility = 'hidden';
  });



  const ProImg = document.querySelector('.bnt_div_3100-3');
  const ProDiv = document.querySelector('.div-pro-show');

  ProImg.addEventListener('mouseenter', () => {
      ProDiv.style.opacity = '1';
      ProDiv.style.visibility = 'visible';
  });


  ProImg.addEventListener('mouseleave', () => {
      ProDiv.style.opacity = '0';
      ProDiv.style.visibility = 'hidden';
  });


  // For sample testing...

  const ButTwo = document.querySelector('.but-test-two');
  const ShowDivTwo = document.querySelector('.div-test-four');

  // All an event listener to the button
  ButTwo.addEventListener('click', function() {
      // Not show
      ExitDiv.replaceWith(ShowDivTwo);
      // Show  the div to show
      ShowDivTwo.style.display = 'block';
  });


  const HomImg = document.querySelector('.bnt_div_3100-1');
  const HomDiv = document.querySelector('.div-home-show');

  HomImg.addEventListener('mouseenter', () => {
      HomDiv.style.opacity = '1';
      HomDiv.style.visibility = 'visible';
  });


  HomImg.addEventListener('mouseleave', () => {
      HomDiv.style.opacity = '0';
      HomDiv.style.visibility = 'hidden';
  });



  const FavImg = document.querySelector('.bnt_div_3100-2');
  const FavDiv = document.querySelector('.div-fav-show');

  FavImg.addEventListener('mouseenter', () => {
      FavDiv.style.opacity = '1';
      FavDiv.style.visibility = 'visible';
  });


  FavImg.addEventListener('mouseleave', () => {
      FavDiv.style.opacity = '0';
      FavDiv.style.visibility = 'hidden';
  });

  //  the end of the work for now




  // styled by: StromKiller003
  // FPH: Product of Freelance Programming Hub