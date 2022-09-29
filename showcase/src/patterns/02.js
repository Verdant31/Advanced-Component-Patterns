import React, { useCallback, useLayoutEffect, useState } from 'react';
import styles from './index.css';
import mojs from 'mo-js';

const initialClapState = {
  count: 0,
  countTotal: 267
}

//Starts - Hook
const useClapAnimation = ({
  clapEl,
  countEl,
  clapTotalEl
}) => {
  const [ animationTimeline, setAnimationTimeline ] = useState(() => new mojs.Timeline());
  console.log('O useClapAnimation foi chamado');

  useLayoutEffect(() => {
    console.log('O effect do useClapAnimation foi chamado com as refs como ', clapEl, countEl, clapTotalEl);
    if(!clapEl || !countEl || !clapTotalEl) return;
    //Defining animation values
    const tlDuration = 300;
    //Defining the animation behavior
    const scaleButton = new mojs.Html({
      el: clapEl,
      duration: 300,
      scale: {1.3: 1},
      easing: mojs.easing.ease.out,
    })
    const triangleBurst = new mojs.Burst({
      parent: clapEl,
      radius: {50 : 95},
      count: 5,
      angle: 30,
      children: {
        shape: 'polygon',
        radius: {6 : 0},
        stroke: 'rgba(211, 54, 0, 0.5)',
        strokeWidth: 2,
        angle: 210,
        delay: 30,
        speed: 0.2,
        duration: tlDuration,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
      }
    }); 
    const circleBurst = new mojs.Burst({
      parent: clapEl,
      radius: {50 : 75},
      count: 5,
      angle: 25,
      duration: tlDuration,
      children: {
        shape: 'circle',
        fill: 'rgba(149, 165, 166, 0.5)',
        delay: 30,
        speed: 0.2,
        radius: {3 : 0},
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
      }
    });
    const countAnimation = new mojs.Html({
      el: countEl,
      opacity: {0: 1},
      duration: tlDuration,
      y: {0: -30},
    }).then({
      opacity: {1: 0},
      delay: tlDuration/2,
      y: -80,
    })
    const countTotalAnimation = new mojs.Html({
      el: clapTotalEl,
      opacity: {0: 1},
      delay: (3 * tlDuration) / 2,
      duration: tlDuration,
      y: {0: -3}
    })
    //Resing the clap div to 1,1
    if(typeof clapEl === 'string') {
      const clap = document.getElementById('#clap');
      clap.style.transform = 'scale(1,1)'
    }else {
      clapEl.style.transform = 'scale(1,1)'
    }
    const newAnimationTimeline = animationTimeline.add([scaleButton, countTotalAnimation, countAnimation, triangleBurst, circleBurst]);
    setAnimationTimeline(newAnimationTimeline)
  }, [clapEl, countEl, clapTotalEl])
  console.log('O useClapAnimation retornou a animação');
  return animationTimeline;
}
//Ends - Hook

const MediumClap = () => {
  const MAXIMUM_USER_CLAP = 12;
  const [clapState, setClapState] = useState(initialClapState);
  const [{clapRef, clapTotalRef, clapCountRef}, setRefs] = useState({})
  const { count, countTotal } = clapState; 

  console.log('O componente MediumClap renderizou');

  const animationTimeline = useClapAnimation({
    clapEl: clapRef,
    countEl: clapCountRef,
    clapTotalEl: clapTotalRef
  });

  const setRef = useCallback(
    (node) => {
      setRefs(oldState=> (
        {
          ...oldState,
          [node.dataset.refkey]: node,
        }
      ))
  },[])


  const handleClapClick = () => {
    animationTimeline.replay();
    setClapState(oldState => ({
      count: Math.min(oldState.count + 1, MAXIMUM_USER_CLAP),
      countTotal: oldState.count < MAXIMUM_USER_CLAP ? oldState.countTotal + 1 : oldState.countTotal
    }))
  }

  return (
    <button data-refkey="clapRef" ref={setRef} onClick={handleClapClick} className={styles.clap}>
      <ClapIcon count={count} />
      <ClapCount count={count} setRef={setRef}/>
      <CountTotal countTotal={countTotal} setRef={setRef}/>
    </button>
  )
}

//Starts - Subcomponents
const ClapIcon = ({count}) => {
  return (
    <span>
      <svg  xmlns='http://www.w3.org/2000/svg' viewBox='-549 338 100.1 125' className={`${styles.icon} ${count > 0 && styles.checked}`}>
        <path d='M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z' />
        <path d='M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9' />
      </svg>
    </span>
  )
}

const ClapCount = ({count, setRef}) => {
  console.log('O componente ClapCount renderizou');
  return <span data-refkey="clapCountRef" ref={setRef} className={styles.count}>+ {count}</span>
}

const CountTotal = ({countTotal, setRef}) => {
  return <span data-refkey="clapTotalRef" ref={setRef} className={styles.total}>{countTotal}</span>
}
//Ends - Subcomponents

//Starts - Usage of our component
const Usage = () => {
  return <MediumClap />
}
//Ends - Usage of our component

export default Usage;

//Explicação da renderização do componente
//1. O componente MediumClap é renderizado
//2. O hook useAnimationClap é chamado, passando valores undefined
//3. O useEffect não é acionado pois o HTML do componente MediumClap ainda não renderizou
//4. O hook useAnimationClap retorna undefined
//5. O HTML do componente MediumClap é renderizado
//6. O useEffect do hook useAnimationClap que estava em espera é acionado, porém ainda com valores undefined
//7. A renderização do HTML do componente MediumClap causa uma mudança no estado (setRef dos subcomponentes)
//8. O componente MediumClap é renderizado novamente
//9. O hook useAnimationClap é chamado, agora passando valores truth pois nessa nova renderização os subcomponentes setaram os valores das refs
//10. O useEffect não é acionado pois o HTML do componente MediumClap ainda não renderizou
//11. O hook useAnimationClap retorna undefined
//12. O HTML do componente MediumClap é renderizado
//13. O useEffect do hook useAnimationClap que estava em espera é acionado, porém agora com os valores truths
//14. Como o valor do Hook mudou, o componente MediumClap renderiza novamente, porém dessa vez com um valor truth de retorno
//15. O hook é chamado novamente, porem como as refs não mudaram o useEffect não é acionado.


