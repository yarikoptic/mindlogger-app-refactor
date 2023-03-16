//
//  FlankerSandboxView.swift
//  MindloggerMobile
//
//  Created by Dzmitry on 16.03.23.
//

import Foundation
import UIKit

@objc(FlankerSandboxView)
class FlankerSandboxView: UIView {
  @objc var onButtonPress: RCTDirectEventBlock?

  @objc var message: NSString = "Test" {
    didSet {
      labelView.text = message as String
    }
  }
  @objc var imageUrl: NSString = "" {
    didSet {
      let url = URL(string: imageUrl as String)
      // "https://cdn.cocoacasts.com/cc00ceb0c6bff0d536f25454d50223875d5c79f1/above-the-clouds.jpg")!
      
      if let data = try? Data(contentsOf: url!) {
          // Create Image and Update Image View
        imageView.image = UIImage(data: data)
      }
          
    }
  }
  
  @objc var labelView: UILabel!
  @objc var imageView: UIImageView!
  @objc var button: UIButton!
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.translatesAutoresizingMaskIntoConstraints = false
        
    setupView()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  private func setupView() {
    labelView = UILabel()
    self.addSubview(labelView)
    labelView.translatesAutoresizingMaskIntoConstraints = false
    
    imageView = UIImageView()
    self.addSubview(imageView)
    imageView.translatesAutoresizingMaskIntoConstraints = false
    imageView.topAnchor.constraint(equalTo: labelView.bottomAnchor).isActive = true
    imageView.heightAnchor.constraint(equalToConstant: 100).isActive = true
    imageView.widthAnchor.constraint(equalToConstant: 100).isActive = true
    
    button = UIButton(type: .system)
    button.isUserInteractionEnabled = true
    button.setTitle("Send to RN", for: .normal)
    button.addTarget(self, action: #selector(self.press(_:)), for: .touchUpInside)
    button.translatesAutoresizingMaskIntoConstraints = false
    self.addSubview(button)
    button.topAnchor.constraint(equalTo: imageView.bottomAnchor, constant: 40).isActive = true
  }
  
  @objc func press(_ sender: UIButton) {
    print("press")
    if onButtonPress != nil {
      onButtonPress!(["message": "Hello native"])
    }
  }
}

