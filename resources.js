window.addEventListener("load", () => {
  const getLocation = async () => {
    const [response, error] = await fetch("https://ipapi.co/json/")
      .then((res) => [res])
      .catch((err) => [null, err]);

    if (error) return { error };

    const data = await response.json();
    return { location: data };
  };

  const submitEmail = async ({ email, location }) => {
    const [response, error] = await fetch(
      "https://mg.libreplus.com/smartpayroll/interest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          location,
        }),
      }
    )
      .then((res) => [res])
      .catch((err) => [null, err]);

    console.log(response, error);

    if (error || !response.ok) {
      if (response.status === 400) {
        return {
          error: "Please enter a valid email.",
        };
      }
      return {
        error: "Woops, something went wrong. Please try again later.",
      };
    }

    return { response };
  };

  const handleEmailInput = (event) => {
    event.preventDefault();

    const form = event.target;
    const emailInput = form.getElementsByTagName("input")[0];

    const email = emailInput.value;
    getLocation().then(async ({ locationError, location }) => {
      const { error } = await submitEmail({
        email,
        location:
          !locationError && `${location.city}, ${location.country_name}`,
      });

      if (error) {
        document.dispatchEvent(
          new CustomEvent("popup", {
            detail: {
              type: "error",
              info: error,
            },
          })
        );
      } else {
        document.dispatchEvent(
          new CustomEvent("popup", {
            detail: {
              type: "success",
              info: "Success! We'll get in touch with you soon.",
            },
          })
        );
      }
    });
  };

  const form = document.getElementById("email-form");
  const mobileForm = document.getElementById("email-form-mobile");

  form.addEventListener("submit", handleEmailInput);
  mobileForm.addEventListener("submit", handleEmailInput);
});
