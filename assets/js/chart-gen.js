class ChartGen {
	constructor(cartesianMap) {
		const container = document.createElement('mapContainer');
		cartesianMap.appendChild(container);
		cartesianMap.querySelector('mapContainer').outerHTML = `
			<div class="chart-gen-container-ref" data-map>
				<div class="chart-gen-container"></div>
			</div>`;
		this.cartesianMap = cartesianMap.querySelector('[data-map]');
		this.cartesianMap.removeAttribute('data-map');
		this.initValues = null;
		const initAction = ()=> {
			if (this.initValues)
				this.cartesianMap.querySelector('.chart-gen-container').innerHTML = '';
				this.init(
					this.initValues.info,
					this.initValues.options,
					this.initValues.callback
				);
		}
		window.removeEventListener('resize',initAction);
		window.addEventListener('resize',initAction);
	}

	getDots() {
		return this.cartesianMap.querySelectorAll('[data-ref]');
	}

	getDotRefs() {
		const dotRefs = [];
		const parentRef = this.cartesianMap.getBoundingClientRect();
		this.getDots(this.cartesianMap).forEach((item,index)=> {
			dotRefs.push({
				'node': item.getBoundingClientRect(),
				'left': item.getBoundingClientRect().left - parentRef.left,
				'bottom': parentRef.bottom - item.getBoundingClientRect().bottom
			});
		});
		return dotRefs;
	}

	calculateLine(dotA, dotB, line, ainmateTime=0) {
		const lineASize = dotB.bottom - dotA.bottom;
		const lineBSize = dotB.left - dotA.left;
		const lineWidth =  Math.sqrt(Math.pow(lineASize, 2) + Math.pow(lineBSize, 2));
		let angle = (Math.atan2(lineASize,lineBSize)) * 180 / Math.PI;
		const alignLineCenter = parseInt(dotA.node.width/2);
		// angle *= 180 / Math.PI;
		// angle += 0.11;
		angle *= (-1);
		line.style.bottom = (dotA.bottom+alignLineCenter)+'px';
		line.style.left = (dotA.left+alignLineCenter)+'px';
		line.style.transform = 'rotate('+(angle)+'deg)';
		setTimeout(()=> {
			line.style.width = lineWidth+'px';
		},ainmateTime);
	}

	calculateBar(dot, bar, ainmateTime=0) {
		let leftRef = dot.left;
		let bottomRef = dot.bottom;
		const barRef = bar.getBoundingClientRect().width/2
		const dotRef = dot.node.width/2;
		bottomRef += parseInt(dotRef);
		leftRef += parseInt(dotRef-barRef);
		bar.style.left = (leftRef)+'px';
		setTimeout(()=> {
			bar.style.height = bottomRef+'px';
		},ainmateTime);
	}

	generateLines(callback) {
		let dotRefs = this.getDotRefs();
		let animatedTime = 75;
		const cartesianMap = this.cartesianMap.querySelector('.chart-gen-container');
		for (let i = 1; i < dotRefs.length; i++) {
			let line = document.createElement('div');
			line.setAttribute('class', 'line');
			cartesianMap.appendChild(line);
			this.calculateLine(dotRefs[i-1],dotRefs[i],line,animatedTime);
			animatedTime += 150;
		}
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+75);
		}
	}

	generateBars(callback) {
		const dotRefs = this.getDotRefs();
		let animatedTime = 75;
		const cartesianMap = this.cartesianMap.querySelector('.chart-gen-container');
		dotRefs.forEach((item,index)=> {
			let bar = document.createElement('div');
			bar.setAttribute('class', 'bar');
			cartesianMap.appendChild(bar);
			this.calculateBar(item,bar,animatedTime);
			animatedTime += 90;
		});
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+175);
		}
	}

	cleanLines(callback) {
		const lines = this.cartesianMap.querySelectorAll('.line');
		let animatedTime = 0;
		Array.from(lines).reverse().forEach((item,index)=> {
			setTimeout(()=> {
				item.style.removeProperty('width');
				setTimeout(()=> {
					item.outerHTML = '';
				},150);
			},animatedTime);
			animatedTime += 150;
		});
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+75);
		}
	}

	cleanBars(callback) {
		const bars = this.cartesianMap.querySelectorAll('.bar');
		let animatedTime = 0;
		Array.from(bars).reverse().forEach((item,index)=> {
			setTimeout(()=> {
				item.style.removeProperty('height');
				setTimeout(()=> {
					item.outerHTML = '';
				},150);
			},animatedTime);
			animatedTime += 150;
		});
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+75);
		}
	}

	cleanDots(callback) {
		const dots = this.cartesianMap.querySelectorAll('.dot');
		let animatedTime = 0;
		Array.from(dots).reverse().forEach((item,index)=> {
			setTimeout(()=> {
				item.classList.remove('show-dot')
			},animatedTime);
			animatedTime += 150;
		});
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+75);
		}
	}

	showDots() {
		const dots = this.cartesianMap.querySelectorAll('.dot');
		let animatedTime = 0;
		Array.from(dots).forEach((item,index)=> {
			setTimeout(()=> {
				item.classList.add('show-dot')
			},animatedTime);
			animatedTime += 150;
		});
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+75);
		}	
	}

	setLimits(values) {
		const limits = {};
		limits.minValue = Math.min.apply(null,values);
		limits.maxValue = Math.max.apply(null,values);
		limits.maxValue = parseInt(limits.maxValue + ((limits.maxValue/100) * 20));
		limits.amount = values.length;
		return limits;
	}

	calculateDotPos(size, maxValue, value) {
		const onePercent = size/100;
		const valuePercent = value/(maxValue/100);
		return (onePercent * valuePercent); 
	}

	generateDots(info={}, showDots=true, callback) {
		// values,, allSteps=0, steps={'only': true}
		const container = this.cartesianMap.getBoundingClientRect();
		const cartesianMap = this.cartesianMap.querySelector('.chart-gen-container');
		const limits = this.setLimits(info.values);
		let step = (container.width-40)/limits.amount;
		let dotLeft = 20 + parseInt(step.toFixed(2)/2);
		if (('maxStep' in info)) {
			step = (container.width-40)/info.maxStep;
		}
		let animatedTime = 75;
		info.values.forEach((item, index)=> {
			const dotBottom = this.calculateDotPos(container.height,limits.maxValue,item);
			const dot = document.createElement('div');
		 	if(('maxStep' in info) && info.maxStep) {
				dotLeft = info.steps[index] * step;
			}
			dot.setAttribute('class', 'dot');
			dot.setAttribute('data-ref', `dot${index+1}`);
			dot.setAttribute('style', `left: ${dotLeft.toFixed(3)}px; bottom: ${dotBottom.toFixed(3)}px;`);
			cartesianMap.appendChild(dot);
			if (!('maxStep' in info)) {
				dotLeft += step;
			}
			if (showDots) {
				setTimeout(()=> {
					dot.classList.add('show-dot');
				},animatedTime)
				animatedTime += 170;
			}
		});
		if (typeof callback === 'function') {
			setTimeout(()=> {
				callback();
			},animatedTime+75);
		}
	}

	init(info={}, options={}, callback=()=>{}) {
		this.initValues = {
			info: info,
			options: options,
			callback: ()=> {
				callback();
			}
		}
		const hasDotSteps = ("steps" in info) && ("maxStep" in info);
		const hasDots = (!("withDots" in options) || options.withDots);

		const barsFunct = (!("withBars" in options) || options.withBars) ? 
		()=> {
			this.generateBars(callback)
		} : ()=>{
			callback();
		};
		const linesFunct = (!("withLines" in options) || options.withLines) ? 
		()=> { 
			this.generateLines(barsFunct)
		} : ()=> {
			barsFunct();
		};
		const dotsFunct = hasDotSteps ? 
		()=> {
			this.generateDots(
				{
					values: info.values,
					maxStep: info.maxStep,
					steps: info.steps
				},
				hasDots,
				()=> {
					linesFunct();
				}
			);
		} : ()=> {
			this.generateDots(
				{
					values: info.values
				},
				hasDots,
				()=> {
					linesFunct();
				}
			);
		};
		dotsFunct();
	}
}