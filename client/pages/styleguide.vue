<template>
  <main class="page-styleguide">
    <div class="wrapper container">
      <section class="section section-headline">
        <p class="section-title">01. Headline</p>
        <h1>Cover up spaceships god helicopter otherworldly</h1>
        <h2>Cover up spaceships god helicopter otherworldly</h2>
        <h3>Cover up spaceships god helicopter otherworldly</h3>
        <h4>Cover up spaceships god helicopter otherworldly</h4>
      </section>

      <section class="section section-paragraph">
        <p class="section-title">02. Paragraph</p>
        <div class="rte">
          <p>
            Vymaanika grey religions legendary dna petroglyph theorists earth mound sumerian pyramids pre. Grey giorgio annunaki von weightless otherworldly sky flying vessels aircraft crystal disc
            helicopter soloman. Punku machu picchu god burmuda triangle portal castle burmuda triangle mahabharata portal clearly. Von puma mutation clearly disc legendary easter island chariot of the
            gods sightings sounds. Pyramids sanskrit golden electromagnetic mercury it megoliths doll theorists.
          </p>

          <ul>
            <li>Visitors punku nazca lines grey</li>
            <li>Sounds foo space travel the answer is a resounding yes king</li>
            <li>Skull god star</li>
            <li>People annunaki ufo</li>
          </ul>

          <p>
            Vymaanika grey religions legendary dna petroglyph theorists earth mound sumerian pyramids pre. Grey giorgio annunaki von weightless otherworldly sky flying vessels aircraft crystal disc
            helicopter soloman. Punku machu picchu god burmuda triangle portal castle burmuda triangle mahabharata portal clearly.
          </p>

          <ol>
            <li>Visitors punku nazca lines grey</li>
            <li>Sounds foo space travel the answer is a resounding yes king</li>
            <li>Skull god star</li>
            <li>People annunaki ufo</li>
          </ol>
        </div>
      </section>

      <section class="section section-buttons">
        <p class="section-title">03. Buttons</p>
        <div class="btns">
          <Button url="https://example.com" icon="arrow-right" label="Discover" />
          <Button url="https://example.com" icon="arrow-diag" target class="outline" label="Discover" />
          <Button url="https://example.com" icon="arrow-diag" target class="red" label="Discover" />
          <Button url="https://example.com" icon="arrow-diag" target class="blue" label="Discover" />
        </div>
      </section>

      <section class="section section-images">
        <p class="section-title">04. Images</p>
        <div class="images">
          <div class="image-container">
            <NuxtImg src="images/example.jpg" alt="Image example" format="webp" />
            <span class="legend">JPG</span>
          </div>
          <div class="image-container vertical">
            <NuxtImg src="images/cat.gif" alt="Gif example" />
            <span class="legend">GIF</span>
          </div>
          <div class="image-container vertical video">
            <video src="../public/images/cat.mp4" autoplay loop muted controls></video>
            <span class="legend">MP4</span>
          </div>
        </div>
      </section>

      <section class="section section-lotties">
        <p class="section-title">05. Lottie</p>
        <lottie-player class="lottie" src="/lottie/alien.json" autoplay loop></lottie-player>
      </section>

      <section class="section section-modal">
        <p class="section-title">06. Modal</p>
        <div class="btns">
          <Button class="modal-trigger" @click="openModal1" label="Open Modal 1" />
          <Button class="modal-trigger" @click="openModal2" label="Open Modal 2" />
        </div>

        <Modal :isOpen="modalOpen1" @close="closeModal1">
          <h3>Modal</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec fermentum nunc.</p>
          <div class="image-container">
            <NuxtImg src="images/example.jpg" alt="Image example" format="webp" />
          </div>
        </Modal>

        <Modal :isOpen="modalOpen2" @close="closeModal2">
          <h3>Modal 2</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec fermentum nunc.</p>
          <div class="image-container">
            <NuxtImg src="images/example.jpg" alt="Image example" format="webp" />
          </div>
        </Modal>
      </section>

      <section class="section section-modal">
        <p class="section-title">07. API</p>

        <div v-if="data.length">
          <ul>
            <li v-for="(project, index) in data" :key="index">
              <strong>{{ project.name }}</strong
              >: {{ project.description }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No projects found.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const config = useRuntimeConfig();

const API_URL = config.public.API_URL;

const endpoint = 'projects';
const apiEndpoint = `${API_URL}/${endpoint}`;

console.log('API Endpoint:', apiEndpoint);

const data = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.get(apiEndpoint);

    if (response.data && response.data.length) {
      data.value = response.data;
    } else {
      console.error('No data available');
    }
  } catch (error) {
    console.error('Error fetching data:', error.response || error.message);
  }
};

onMounted(() => {
  const animation = document.querySelector('.lottie');
  animation.style.width = '200px';

  fetchData();
});

const modalOpen1 = ref(false);
const modalOpen2 = ref(false);

const openModal1 = () => {
  modalOpen1.value = true;
};

const openModal2 = () => {
  modalOpen2.value = true;
};

const closeModal1 = () => {
  modalOpen1.value = false;
};

const closeModal2 = () => {
  modalOpen2.value = false;
};
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;

.section-title {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 800;
  font-family: $vinila;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
  padding: 8px;
  background: $white;
  border: 1px solid $black;
  width: fit-content;
  border-radius: 2px;
}

// .lootie {
//   width: 200px !important;
// }

.video {
  width: 100%;
  height: auto;
  border-radius: 4px;
  aspect-ratio: 9/16;

  video {
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 9/16;
  }
}

.images {
  display: flex;
  gap: 12px;
  max-height: 700px;

  .image-container {
    position: relative;
    width: 500px;
    height: 100%;
    border-radius: 4px;
    // overflow: hidden;

    .legend {
      position: absolute;
      bottom: -25px;
      left: 0;
      color: $black;
      font-size: 12px;
      text-align: center;
    }

    &.vertical {
      aspect-ratio: 9/16;
    }

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }
}
</style>
