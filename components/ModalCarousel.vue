<!-- components/ModalCarousel.vue -->
<template>
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div class="relative w-full max-w-4xl md:max-w-5xl lg:max-w-6xl p-4 bg-white rounded-lg">
        <button class="absolute top-0 right-0 p-6 text-white" style="z-index: 100;" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
  
        <!-- Carousel wrapper -->
        <div class="relative h-56 md:h-80 lg:h-[70vh] overflow-hidden rounded-lg">
          <div v-for="(image, index) in images" :key="index" :class="['absolute block w-full duration-700 ease-in-out', currentIndex === index ? 'opacity-100' : 'opacity-0']">
            <img :src="image" class="w-full h-full object-contain" />
          </div>
        </div>
  
        <!-- Slider indicators -->
        <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3" style="z-index: 100;">
          <button v-for="(image, index) in images" :key="index" @click="setCurrentIndex(index)"
                  :class="['w-3 h-3 rounded-full', currentIndex === index ? 'bg-white' : 'bg-gray-400']" aria-label="'Slide ' + (index + 1)">
          </button>
        </div>
  
        <!-- Slider controls -->
        <button @click="prevImage" class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg class="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
          </span>
        </button>
        <button @click="nextImage" class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg class="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    showModal: Boolean,
    images: Array,
    startIndex: Number
  })
  
  const emit = defineEmits(['close'])
  
  const currentIndex = ref(props.startIndex)
  
  watch(props.startIndex, (newIndex) => {
    currentIndex.value = newIndex
  })
  
  function closeModal() {
    emit('close')
  }
  
  function prevImage() {
    currentIndex.value = (currentIndex.value > 0) ? currentIndex.value - 1 : props.images.length - 1
  }
  
  function nextImage() {
    currentIndex.value = (currentIndex.value < props.images.length - 1) ? currentIndex.value + 1 : 0
  }
  
  function setCurrentIndex(index) {
    currentIndex.value = index
  }
  </script>
  