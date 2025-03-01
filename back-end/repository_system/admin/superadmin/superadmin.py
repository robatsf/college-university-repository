JAZZMIN_SETTINGS = {
    "site_title": "HUDC super Admin",
    "site_header": "HUDC ADMIN LOGIN ",
    "site_brand": "HUDC IR",
    "site_logo": "image/hu.jpeg",
    "custom_css": "css/custom_jazzmin.css",

    # Welcome text on the login screen
    "welcome_sign": "Welcome to the HUDC IR SYSTEM",

    # Copyright on the footer
    "copyright": "HUDC IR",

    # Avatar image (can be a static image)
    "user_avatar": None,

    ############
    # Top Menu #
    ############
    "topmenu_links": [],

    #############
    # Side Menu #
    #############
    "order_with_respect_to": ["auth", "books", "books.author", "books.book"],

    # Custom links to append to app groups, keyed on app name
    "custom_links": {
        "books": [{
            "name": "Make Messages", 
            "url": "make_messages", 
            "icon": "fas fa-comments",
            "permissions": ["books.view_book"]
        }]
    },

    # Custom icons for side menu apps/models.
    # The keys follow the format "app_label.modelname" (use lower-case for the model name).
    "icons": {
        # Built-in auth app
        "auth": "fas fa-user-cog",
        "auth.user": "fas fa-user",
        "auth.group": "fas fa-user",
        
        # Custom 'Authentication' app models:
        "Authentication.student": "fas fa-user-graduate",    # Student model
        "Authentication.Teacher": "fas fa-user-tie", 
        "Authentication.guest": "fas fa-user-secret",          # Guest model
        "Authentication.request": "fas fa-envelope-open-text", # Request model
        "Authentication.filesystem": "fas fa-folder-open",     # FileSystem model
        "Authentication.history": "fas fa-history",            # History model
        "Authentication.permissions": "fas fa-key",            # Permissions model
        "Authentication.notification": "fas fa-bell",          # Notification model
        "Authentication.download": "fas fa-download",          # Download model
        "Authentication.admin": "fas fa-user-shield",          # Admin model
        "Authentication.Librarian": "fas fa-book-reader",       # Librarian model
        "Authentication.DepartmentHead": "fas fa-chalkboard-teacher",
        "Files.PermissionSetting": "fas fa-user-shield",
        "Files.Request": "fas fa-user-cog",
        "Files.Departmentlist": "fas fa-clipboard-list"

    },

    # Default icons when one is not manually specified
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",

    #################
    # Related Modal #
    #################
    "related_modal_active": False,

    #############
    # UI Tweaks #
    #############
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,

    ###############
    # Change view #
    ###############
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs"
    },
    
    "brand_colour": "white",
    "accent": "accent-primary",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": True,
    "body_small_text": True,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": True,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": True,
    "sidebar_nav_legacy_style": True,
    "sidebar_nav_flat_style": True,
    "theme": "litera",  # Options include: default, darkly, cyborg, slate, solar, superhero, etc.
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-outline-info",
        "warning": "btn-outline-warning",
        "danger": "btn-outline-danger",
        "success": "btn-outline-success"
    }
}
