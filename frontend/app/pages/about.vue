<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[500px] flex items-center justify-center text-center text-white">
      <div class="absolute inset-0 bg-black/40 z-10"></div>
      <img 
        src="/5.jpg" 
        alt="Greenhouse" 
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="relative z-20 container mx-auto px-4">
        <h1 class="text-5xl md:text-6xl font-serif mb-4">Вдохновленные природой</h1>
        <p class="text-xl font-light max-w-2xl mx-auto">
          Мы верим, что каждый заслуживает частичку природы в своей повседневной жизни.
        </p>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h2 class="text-3xl font-serif mb-8 text-primary">Наша история</h2>
        <div class="prose prose-lg mx-auto text-gray-600 leading-relaxed">
          <p class="mb-6">
            Все началось с одного суккулента на подоконнике. То, что начиналось как небольшое хобби, быстро переросло в страсть к успокаивающей и восстанавливающей силе растений. Мы поняли, что в нашем занятом цифровом мире мы теряем связь с природными ритмами, которые дают нам опору.
          </p>
          <p>
            «The Green House» родился из желания преодолеть этот разрыв. Мы не просто магазин растений; мы — кураторы живого искусства. Мы ищем в местных питомниках и на экологических фермах растения, которые не только красивы, но и здоровы, и готовы процветать в вашем доме. Мы верим, что уход за растением — это акт заботы о себе, момент осознанности в хаотичном дне.
          </p>
        </div>
      </div>
    </section>

    <!-- Values Grid -->
    <section class="py-20 bg-[#f4f7f6]">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
          <div class="space-y-4">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
              <Icon name="lucide:leaf" size="32" />
            </div>
            <h3 class="text-xl font-serif font-bold">Экологичное выращивание</h3>
            <p class="text-gray-600 text-sm">
              Мы сотрудничаем с фермерами, которые заботятся об экологии, минимизируя потребление воды и избегая вредных пестицидов.
            </p>
          </div>
          <div class="space-y-4">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
              <Icon name="lucide:heart-handshake" size="32" />
            </div>
            <h3 class="text-xl font-serif font-bold">Поддержка навсегда</h3>
            <p class="text-gray-600 text-sm">
              Мы не просто продаем вам растение. Наша команда всегда готова помочь вашим зеленым друзьям процветать.
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
            <div class="text-sm uppercase tracking-widest opacity-80">Растений нашли дом</div>
          </div>
          <div>
            <div class="text-4xl font-serif font-bold mb-2">150+</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Разных сортов</div>
          </div>
          <div>
            <div class="text-4xl font-serif font-bold mb-2">99%</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Довольных клиентов</div>
          </div>
          <div>
            <div class="text-4xl font-serif font-bold mb-2">24/7</div>
            <div class="text-sm uppercase tracking-widest opacity-80">Экспертная помощь</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team / CTA -->
    <section class="py-20 container mx-auto px-4 text-center">
      <h2 class="text-3xl font-serif mb-8">Готовы пополнить свою коллекцию?</h2>
      <p class="text-gray-600 mb-8 max-w-xl mx-auto">
        Будь вы опытным ботаником или полным новичком, у нас есть идеальное растение, которое ждет именно вас.
      </p>
      <NuxtLink to="/shop" class="inline-block bg-primary text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        Начать покупки
      </NuxtLink>
    </section>
  </div>
</template>
