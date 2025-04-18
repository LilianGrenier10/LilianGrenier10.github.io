document.addEventListener("DOMContentLoaded", () => {
    // Carousel functionality
    initCarousel()
  
    // Plastic calculator
    initPlasticCalculator()
  
    // Pledge form
    initPledgeForm()
  })
  
  // Carousel functionality
  function initCarousel() {
    const carousel = document.getElementById("facts-carousel")
    const prevButton = document.getElementById("prev-button")
    const nextButton = document.getElementById("next-button")
    const dotsContainer = document.getElementById("carousel-dots")
  
    // Get all carousel items
    const items = carousel.querySelectorAll(".carousel-item")
    const itemCount = items.length
    let currentIndex = 0
    let autoplayInterval
  
    // Create dots
    items.forEach((_, index) => {
      const dot = document.createElement("button")
      dot.classList.add("carousel-dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })
  
    // Update dots
    function updateDots() {
      const dots = dotsContainer.querySelectorAll(".carousel-dot")
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add("active")
        } else {
          dot.classList.remove("active")
        }
      })
    }
  
    // Go to specific slide
    function goToSlide(index) {
      currentIndex = index
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`
      updateDots()
      resetAutoplay()
    }
  
    // Previous slide
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + itemCount) % itemCount
      goToSlide(currentIndex)
    })
  
    // Next slide
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % itemCount
      goToSlide(currentIndex)
    })
  
    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % itemCount
        goToSlide(currentIndex)
      }, 5000)
    }
  
    function resetAutoplay() {
      clearInterval(autoplayInterval)
      startAutoplay()
    }
  
    startAutoplay()
  }
  
  // Plastic calculator
  function initPlasticCalculator() {
    const plasticItems = [
      { id: "bottles", name: "Bouteilles d'eau", weeklyUsage: 3, weight: 20 },
      { id: "bags", name: "Sacs plastiques", weeklyUsage: 2, weight: 5 },
      { id: "straws", name: "Pailles", weeklyUsage: 1, weight: 0.5 },
      { id: "containers", name: "Contenants alimentaires", weeklyUsage: 4, weight: 30 },
      { id: "cups", name: "Gobelets jetables", weeklyUsage: 2, weight: 10 },
    ]
  
    const plasticItemsContainer = document.getElementById("plastic-items")
    const calculateButton = document.getElementById("calculate-button")
    const resultsContainer = document.getElementById("results")
    const totalItemsElement = document.getElementById("total-items")
    const totalWeightElement = document.getElementById("total-weight")
    const impactProgressElement = document.getElementById("impact-progress")
  
    // Create sliders for each plastic item
    plasticItems.forEach((item) => {
      const sliderItem = document.createElement("div")
      sliderItem.classList.add("slider-item")
  
      const sliderHeader = document.createElement("div")
      sliderHeader.classList.add("slider-header")
  
      const sliderLabel = document.createElement("span")
      sliderLabel.classList.add("slider-label")
      sliderLabel.textContent = `${item.name}: ${item.weeklyUsage} par semaine`
  
      const sliderValue = document.createElement("span")
      sliderValue.classList.add("slider-value")
      sliderValue.textContent = `${item.weeklyUsage * 52} par an`
      sliderValue.id = `${item.id}-yearly`
  
      sliderHeader.appendChild(sliderLabel)
      sliderHeader.appendChild(sliderValue)
  
      const slider = document.createElement("input")
      slider.type = "range"
      slider.min = "0"
      slider.max = "20"
      slider.step = "1"
      slider.value = item.weeklyUsage
      slider.classList.add("slider")
      slider.id = item.id
  
      slider.addEventListener("input", () => {
        const weeklyValue = Number.parseInt(slider.value)
        const yearlyValue = weeklyValue * 52
        sliderLabel.textContent = `${item.name}: ${weeklyValue} par semaine`
        sliderValue.textContent = `${yearlyValue} par an`
        item.weeklyUsage = weeklyValue
      })
  
      sliderItem.appendChild(sliderHeader)
      sliderItem.appendChild(slider)
  
      plasticItemsContainer.appendChild(sliderItem)
    })
  
    // Calculate button click handler
    calculateButton.addEventListener("click", () => {
      const totalYearlyItems = plasticItems.reduce((sum, item) => sum + item.weeklyUsage * 52, 0)
      const totalYearlyWeight = plasticItems.reduce((sum, item) => sum + item.weeklyUsage * 52 * item.weight, 0)
  
      totalItemsElement.textContent = `${totalYearlyItems} articles`
      totalWeightElement.textContent = `${(totalYearlyWeight / 1000).toFixed(1)} kg`
  
      // Set progress bar width (max at 500 items)
      const progressPercentage = Math.min((totalYearlyItems / 500) * 100, 100)
      impactProgressElement.style.width = `${progressPercentage}%`
  
      resultsContainer.classList.remove("hidden")
    })
  }
  
  // Pledge form
  function initPledgeForm() {
    const pledgeOptions = [
      { id: "bottles", label: "Je m'engage à utiliser une gourde réutilisable au lieu de bouteilles en plastique" },
      { id: "bags", label: "Je m'engage à utiliser des sacs réutilisables pour mes courses" },
      { id: "straws", label: "Je m'engage à refuser les pailles en plastique" },
      { id: "containers", label: "Je m'engage à privilégier les contenants réutilisables pour mes repas à emporter" },
      { id: "bulk", label: "Je m'engage à acheter en vrac quand c'est possible" },
      { id: "custom", label: "Je m'engage à prendre une autre action (précisez ci-dessous)" },
    ]
  
    const pledgeOptionsContainer = document.getElementById("pledge-options")
    const customPledgeContainer = document.getElementById("custom-pledge-container")
    const pledgeForm = document.getElementById("pledge-form")
    const pledgeCard = document.querySelector(".pledge-card")
    const pledgeSuccess = document.getElementById("pledge-success")
    const pledgeCountMessage = document.getElementById("pledge-count-message")
    const shareButton = document.getElementById("share-button")
  
    let selectedPledges = []
  
    // Create checkboxes for each pledge option
    pledgeOptions.forEach((option) => {
      const checkboxItem = document.createElement("div")
      checkboxItem.classList.add("checkbox-item")
  
      const checkbox = document.createElement("div")
      checkbox.classList.add("checkbox")
      checkbox.id = option.id
  
      const label = document.createElement("label")
      label.textContent = option.label
      label.htmlFor = option.id
  
      checkbox.addEventListener("click", () => {
        checkbox.classList.toggle("checked")
  
        if (checkbox.classList.contains("checked")) {
          selectedPledges.push(option.id)
        } else {
          selectedPledges = selectedPledges.filter((id) => id !== option.id)
        }
  
        // Show/hide custom pledge textarea
        if (option.id === "custom") {
          if (checkbox.classList.contains("checked")) {
            customPledgeContainer.classList.remove("hidden")
          } else {
            customPledgeContainer.classList.add("hidden")
          }
        }
      })
  
      checkboxItem.appendChild(checkbox)
      checkboxItem.appendChild(label)
  
      pledgeOptionsContainer.appendChild(checkboxItem)
    })
  
    // Form submission
    pledgeForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const customPledge = document.getElementById("custom-pledge").value
  
      // In a real app, you would send this data to a server
      console.log({
        name,
        email,
        pledges: selectedPledges,
        customPledge,
      })
  
      // Update success message
      pledgeCountMessage.textContent = `Vous avez pris ${selectedPledges.length} engagement(s) pour réduire votre consommation de plastique. Ensemble, nous pouvons faire la différence!`
  
      // Show success message
      pledgeCard.classList.add("hidden")
      pledgeSuccess.classList.remove("hidden")
    })
  
    // Share button
    shareButton.addEventListener("click", () => {
      const shareText = `Je viens de m'engager à réduire mon utilisation de plastique! Rejoignez-moi dans cette démarche pour protéger notre planète. #ZeroPlastique #EngagementÉcologique`
  
      if (navigator.share) {
        navigator.share({
          title: "Mon engagement zéro plastique",
          text: shareText,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support the Web Share API
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`,
          "_blank",
        )
      }
    })
  }
  