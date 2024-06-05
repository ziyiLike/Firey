<template>
  <div class="index-page">
    <span>Firey</span>
    <span>A cross-era framework for Node Js Web services</span>

    <button class="button" @click="openPath">Get Started -></button>
  </div>
</template>

<script setup>
const openPath = () => {
  location.href = '/document/指南/前言'
}
</script>

<style lang="scss" scoped>
.index-page {
  height: 600px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span:nth-child(1) {
    font-size: 50px;
    font-weight: 600;
    margin-bottom: 100px;
    color: var(--vp-home-hero-name-color);
  }

  span:nth-child(2) {
    text-align: center;
    line-height: 42px;
    font-size: 42px;
    font-weight: 400;
    margin-bottom: 80px;
    color: var(--vp-home-hero-text-color);
  }
}

.button {
  width: 160px;
  height: 45px;
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease 0s !important;
  cursor: pointer;
  outline: none;
}

.button:hover {
  background-color: var(--vp-home-hero-name-color);
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.3);
  color: #fff;
  transform: translateY(-7px);
}
</style>