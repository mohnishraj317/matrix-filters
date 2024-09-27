export const cnv = {
  filtered: document.querySelector(".filtered"),
  image: document.querySelector(".image"),
  preview: document.querySelector(".preview")
};

export const ctx = Object.fromEntries(Object.entries(cnv).map(([k, v]) => {
  return [k, v.getContext("2d")]
}));

export const KERNEL_MATRIX =
[
  [.2, .3, .5],
  [-.2, .9, -.4],
  [.3, -.5, .2]
]
//[
//  [0, 0, -.2, 0, 0],
//  [0, -.2, -.5, -.2, 0],
//  [-.2, -.5, 5, -.5, -.2],
//  [0, -.2, -.5, -.2, 0],
//  [0, 0, -.2, 0, 0],
//]
//
//[
//  [.25, .50, .25],
//  [0, 0, 0],
//  [-.25, -.50, -.25]
//]
//[
//  [.25, 0, -.25],
//  [.50, 0, -.50],
//  [.25, 0, -.25]
//]
//
//export const KERNEL_MATRIX = [
//  [.003, .013, .022, .013, .003],
//  [.013, .060, .098, .060, .013],
//  [.022, .098, .162, .098, .022],
//  [.013, .060, .098, .060, .013],
//  [.003, .013, .022, .013, .003],
//]
//
//export const KERNEL_MATRIX = [
//  [.25, .25],
//  [.25, .25]
//]
