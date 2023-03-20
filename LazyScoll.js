import React, { Children, useEffect, useRef, useState } from 'react';

import useInView from 'hooks/useInView';

import * as S from './styled/LazyScroll.styled';

const LazyElement = (props) => {
	const { child } = props;
	const triggerElement = useRef();
	const isTriggerInView = useInView(triggerElement, { threshold: 0.5 });

	const [isRendered, setIsRendered] = useState(false);

	useEffect(() => {
		//if it is alreadyt rendered, don't destructor the component
		if (isTriggerInView) setIsRendered(true);
	}, [isTriggerInView]);

	return (
		<S.LazyElement>
			<div ref={triggerElement} />
			{isRendered && child}
		</S.LazyElement>
	);
};

/**
 * @description LazyScroll component renders children with a delay and shows them if they are in viewport
 * @param {import("react").ReactElement} children
 * @param {number} offset number of children to render at once
 * @param {number} delay delay in ms
 */
const LazyScroll = ({ children, offset: defaultOffset, delay, ...props }) => {
	const [offset, setOffset] = useState(defaultOffset);

	useEffect(() => {
		setTimeout(() => {
			if (offset < React.Children.count(children)) setOffset(offset + defaultOffset);
		}, delay);
	}, [offset]);

	return (
		<div {...props}>
			{Children.map(children, (child, index) => {
				if (index <= offset) return <LazyElement key={index} child={child} index={index} />;
			})}
		</div>
	);
};

export default LazyScroll;
LazyScroll.defaultProps = {
	offset: 2,
	delay: 500
};
