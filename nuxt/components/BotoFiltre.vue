<script>

</script>

<template>
    <div class="radio-card">
    <input type="radio" id="option1" name="options" />
    <label for="option1">Més votat</label>
  </div>

  <div class="radio-card">
    <input type="radio" id="option2" name="options" />
    <label for="option2">Menys votat</label>
  </div>

  <div class="radio-card">
    <input type="radio" id="option3" name="options" />
    <label for="option3">Titol Alfabeticament</label>
  </div>

  <div class="radio-card">
    <input type="radio" id="option4" name="options" />
    <label for="option4">Autor Alfabeticament</label>
  </div>
</template>

<style scoped>

    .radio-card {
        background-color: #D9D9D9;
        font-size: 0.75em;
        display: inline-block;
        margin: 10px;
        padding: 10px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.5s;
    }

    input[type="radio"] {
        display: none; /* Amaga el radio button per defecte*/
    }

    .radio-card:has(input[type="radio"]:checked) {
        background-color: #83AEE4;
        border-color: #83AEE4;
    }

</style>