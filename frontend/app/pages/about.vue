<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[500px] flex items-center justify-center text-center text-white">
      <div class="absolute inset-0 bg-black/40 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
        alt="Greenhouse" 
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="relative z-20 container mx-auto px-4">
        <h1 class="text-5xl md:text-6xl font-serif mb-4">Rooted in Passion</h1>
        <p class="text-xl font-light max-w-2xl mx-auto">
          We believe that everyone deserves a little bit of nature in their daily lives.
        </p>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h2 class="text-3xl font-serif mb-8 text-primary">Our Story</h2>
        <div class="prose prose-lg mx-auto text-gray-600 leading-relaxed">
          <p class="mb-6">
            It started with a single succulent on a windowsill. What began as a small hobby quickly blossomed into an obsession with the calming, restorative power of plants. We realized that in our busy, digital-first world, we were losing touch with the natural rhythms that ground us.
          </p>
          <p>
            "The Green House" was born out of a desire to bridge that gap. We aren't just a plant shop; we are curators of living art. We scour local nurseries and sustainable farms to find plants that are not only beautiful but healthy and ready to thrive in your home. We believe that caring for a plant is an act of self-care, a moment of mindfulness in a chaotic day.
          </p>
        </div>
      </div>
    </section>

    <!-- Values Grid -->
    <section class="py-20 bg-[#f4f7f6]">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div class="space-y-4">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
              <Icon name="lucide:leaf" size="32" />
            </div>
            <h3 class="text-xl font-serif font-bold">Sustainably Grown</h3>
            <p class="text-gray-600 text-sm">
              We partner with growers who prioritize eco-friendly practices, minimizing water usage and avoiding harmful pesticides.
            </p>
          </div>
          <div class="space-y-4">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
              <Icon name="lucide:heart-handshake" size="32" />
            </div>
            <h3 class="text-xl font-serif font-bold">Guidance for Life</h3>
            <p class="text-gray-600 text-sm">
              We don't just sell you a plant and wish you luck. Our team provides ongoing support to ensure your green friends flourish.
            </p>
          </div>
          <div class="space-y-4">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
              <Icon name="lucide:truck" size="32" />
            </div>
            <h3 class="text-xl font-serif font-bold">Safe Delivery</h3>
            <p class="text-gray-600 text-sm">
              Our specialized packaging ensures your plants arrive safe, sound, and ready to brighten your space, no matter the season.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-primary text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
          <div>
            <div class="text-4xl font-serif font-bold mb-2">5k+</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Plants Homed</div>
          </div>
          <div>
            <div class="text-4xl font-serif font-bold mb-2">150+</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Varieties</div>
          </div>
          <div>
            <div class="text-4xl font-serif font-bold mb-2">99%</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Happy Customers</div>
          </div>
          <div>
            <div class="text-4xl font-serif font-bold mb-2">24/7</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Expert Support</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team / CTA -->
    <section class="py-20 container mx-auto px-4 text-center">
      <h2 class="text-3xl font-serif mb-8">Ready to grow your collection?</h2>
      <p class="text-gray-600 mb-8 max-w-xl mx-auto">
        Whether you are a seasoned botanist or a complete beginner, we have the perfect plant waiting for you.
      </p>
      <NuxtLink to="/shop" class="inline-block bg-primary text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        Start Exploring
      </NuxtLink>
    </section>
  </div>
</template>
