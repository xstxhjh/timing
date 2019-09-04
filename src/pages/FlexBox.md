[title]: # (了解 Flexbox 弹性盒子布局)
[date]: # (2019-03-11 &nbsp; 12:21:59)
[categories]: # (响应式布局)
[description]: # (Flexbox 布局（也叫Flex布局，弹性盒子布局）可以使元素对齐变得容易，适合小规模布局。<br> 在所有的道别里，我还是最喜欢明天见。)
[image]: # (https://i.loli.net/2019/09/04/bDKS9RvLfl4ken5.jpg)

---

> 本文只是介绍 Flexbox 布局的一些属性，想了解更多吗？↓ ↓ ↓
>
> **CSS3 Flexbox 解决方案** > > > https://magic-akari.github.io/solved-by-flexbox
>
> 栅格系统、圣杯布局、组件、媒体对象、粘性页脚、垂直居中
>
> **Flex 布局教程：实例篇** > > > http://www.ruanyifeng.com/blog/2015/07/flex-examples.html

# Flex 容器（flex container）

## display

用来定义一个 flex 容器。如果设置为 flex 则容器呈现为块状元素，设置为 inline-flex 则容器呈现为行内元素。

```css
.container {
  display: flex; /* 或者 inline-flex */
}
```

## flex-direction

flex-direction 属性确立了主轴，从而定义了 flex 项在 flex 容器中的排布方向。

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
  /* row 行排布
  row-reverse 反向行排布
  column 列排布
  column-reverse 反向列排布 */
}
```

## flex-wrap

flex-wrap 来决定 flex 项是否允需要换行。

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
  /* nowrap 不换行
  wrap 换行
  wrap-reverse 向上换行 */
}
```

## flex-flow

这是 flex-direction 和 flex-wrap 属性的缩写形式。

```css
flex-flow: row nowrap;
```

## justify-content

justify-content 属性定义了 flex 项沿主轴方向的对齐方式。

```css
.container {
  justify-content: flex-start|flex-end|center|space-between|space-around|initial|inherit;
  /* flex-start  默认值。项目位于容器的开头。
  flex-end  项目位于容器的结尾。
  center  项目位于容器的中心。
  space-between  项目位于各行之间留有空白的容器内。
  space-around  项目位于各行之前、之间、之后都留有空白的容器内。
  initial	 设置该属性为它的默认值。
  inherit  从父元素继承该属性。 */
}
```

## align-items

align-items 定义了 flex 项如何沿当前行在交叉轴上排布的默认行为。可以将其视为交叉轴（垂直于主轴）上的对齐方式。

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
  /* stretch  默认值。元素被拉伸以适应容器。
  center  元素位于容器的中心。
  flex-start	元素位于容器的开头。
  flex-end	元素位于容器的结尾。
  baseline  元素位于容器的基线上。
  initial	 设置该属性为它的默认值。
  inherit  从父元素继承该属性。 */
}
```

## align-content

当交叉轴上有剩余空间时，align-content 可以设置 flex 容器中的 行 在交叉轴上如何分配剩余空间。
类似于 justify-content 在主轴上对齐单个 flex 项的方式，当只有一行 flex 项时，此属性不起作用。

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```

---

# Flex 容器里面的项 (flex items)

> 注意：float,clear 和 vertical-align 在 flex item（flex 项）上都不会起作用，也不会让它脱离文档流。

## order

order 属性可以控制它们在 flex 容器中的显示顺序。

```css
.item {
  order: <integer>; /* 默认值是 0 */
}
```

## flex-grow

flex-grow 定义了 flex 项在有可用剩余空间时拉伸比例。

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

## flex-shrink

flex-shrink 定义了 flex 项的收缩的能力。

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

## flex-basis

flex-basis 定义了在分配剩余空间之前 flex 项默认的大小。
flex-basis 影响元素在主轴(main axis)上的大小。

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

## flex

flex 是 flex-grow、flex-shrink、flex-basis 三个属性的缩写。
其中第二个和第三个参数(flex-shrink 和 flex-basis)是可选的。

```css
.item {
  flex: none | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
}
```

## align-self

align-self 属性允许某个单独的 flex 项覆盖默认的对齐方式（或由 align-items 指定的对齐方式）。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```