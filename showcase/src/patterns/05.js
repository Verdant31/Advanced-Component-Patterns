import React, { createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './index.css';
import customStyles from './usage.css';
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

  useLayoutEffect(() => {
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
  return animationTimeline;
}
//Ends - Hook

const MediumClapContext = createContext({});

const MediumClap = ({
    children, 
    onClap, 
    values = null,
    style : userStyles = {}, 
    className
}) => {
  const MAXIMUM_USER_CLAP = 12;
  const [clapState, setClapState] = useState(initialClapState);
  
  const [{clapRef, clapTotalRef, clapCountRef}, setRefs] = useState({})
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

  const componentDidMount = useRef(true);
  useEffect(() => {
    if(!componentDidMount.current && !isControlled) {
        onClap && onClap(clapState)
    }
    componentDidMount.current = false;
  },[clapState.count, isControlled, onClap])

  const isControlled = values !== null && onClap !== undefined;

  const handleClapClick = () => {
    animationTimeline.replay();
    isControlled 
        ? onClap() 
        : setClapState(oldState => ({
            count: Math.min(oldState.count + 1, MAXIMUM_USER_CLAP),
            countTotal: oldState.count < MAXIMUM_USER_CLAP ? oldState.countTotal + 1 : oldState.countTotal
        }))
  }

  const getState = useCallback(
    () => (isControlled ? values : clapState),
  [isControlled, values, clapState])
  
  const memoizedProviderValue = useMemo(() => ({
        ...getState(),
        setRef
    }),[getState, setRef])
    const classNames = [styles.clap, className].join(' ').trim();
  return (
    <MediumClapContext.Provider value={memoizedProviderValue}>
        <button style={userStyles} data-refkey="clapRef" ref={setRef} onClick={handleClapClick} className={classNames}>
            {children}
        </button>
    </MediumClapContext.Provider>
  )
}

//Starts - Subcomponents
MediumClap.Icon = function ClapIcon({ style : userStyles = {} , className}) {
    const { count } = useContext(MediumClapContext)
    const classNames = [styles.icon, count > 0 ? styles.checked : '', className].join(' ').trim();

  return (
    <span>
      <svg  xmlns='http://www.w3.org/2000/svg' viewBox='-549 338 100.1 125' className={classNames} style={userStyles}>
        <path d='M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z' />
        <path d='M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9' />
      </svg>
    </span>
  )
}
MediumClap.Count = function ClapCount({ style : userStyles = {}, className}) {
    const { count, setRef } = useContext(MediumClapContext);
    const classNames = [styles.count, className].join(' ').trim();

    return <span data-refkey="clapCountRef" ref={setRef} className={classNames} style={userStyles}>+ {count}</span>;
}
MediumClap.Total = function CountTotal ({ styles : userStyles = {}, className}) {
    const {countTotal, setRef} = useContext(MediumClapContext);
    const classNames = [styles.total, className].join(' ').trim();

  return <span  data-refkey="clapTotalRef" ref={setRef} className={classNames} style={userStyles}>{countTotal}</span>
}
//Ends - Subcomponents

//Starts - Usage of our component
const MAXIMUM_CLAP_VAL = 10;
const INITIAL_STATE = {
    count: 0,
    countTotal: 2100
}
const Usage = () => {
    const [ state, setState ] = useState(INITIAL_STATE);
    const handleClap = () => {
        setState(({count, countTotal} )=> ({
            count: Math.min(state.count + 1, MAXIMUM_CLAP_VAL),
            countTotal: count < MAXIMUM_CLAP_VAL ? countTotal + 1 : countTotal
        }));
    }
  return (
    <div style={{width: '100%'}}>
        <MediumClap values={state} onClap={handleClap} className={customStyles.clap}>
            <MediumClap.Icon className={customStyles.icon} />
            <MediumClap.Count className={customStyles.count}/>
            <MediumClap.Total className={customStyles.total}/>
        </MediumClap>
        <MediumClap values={state} onClap={handleClap} className={customStyles.clap}>
            <MediumClap.Icon className={customStyles.icon} />
            <MediumClap.Count className={customStyles.count}/>
            <MediumClap.Total className={customStyles.total}/>
        </MediumClap>
    </div>
  )
}
//Ends - Usage of our component

export default Usage;



